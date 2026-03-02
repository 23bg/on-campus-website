import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/auth";
import { edgeLogger, getOrCreateRequestId, REQUEST_ID_HEADER } from "@/lib/request-logger";

const PUBLIC_PATHS = ["/login", "/signup", "/verification", "/pricing", "/demo-institute"];
const ONBOARDING_PATH = "/onboarding";
const BILLING_PATH = "/billing";
const APP_PROTECTED_PATHS = [
    "/leads",
    "/students",
    "/team",
    "/courses",
    "/batches",
    "/fees",
    "/institute",
    "/settings",
    "/billing",
    "/profile",
];

const normalizeDashboardPath = (pathname: string): string | null => {
    if (!pathname.startsWith("/dashboard")) return null;
    const remainder = pathname.slice("/dashboard".length);
    if (!remainder) return "/";
    return remainder.startsWith("/") ? remainder : `/${remainder}`;
};

const isPublicPath = (pathname: string): boolean =>
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

const getSessionToken = (req: NextRequest): string | undefined =>
    req.cookies.get("session_token")?.value || req.cookies.get("access_token")?.value;

const isProtectedPath = (pathname: string): boolean =>
    pathname.startsWith(ONBOARDING_PATH) || APP_PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const requestId = getOrCreateRequestId(req.headers);

    const buildRequestHeaders = () => {
        const headers = new Headers(req.headers);
        headers.set(REQUEST_ID_HEADER, requestId);
        return headers;
    };

    const setResponseTraceHeader = (res: NextResponse): NextResponse => {
        res.headers.set(REQUEST_ID_HEADER, requestId);
        return res;
    };

    edgeLogger.info("request_received", {
        requestId,
        method: req.method,
        pathname,
    });

    const normalizedPath = normalizeDashboardPath(pathname);
    if (normalizedPath) {
        edgeLogger.info("request_redirected", {
            requestId,
            reason: "normalize_dashboard_path",
            from: pathname,
            to: normalizedPath,
        });
        return setResponseTraceHeader(NextResponse.redirect(new URL(normalizedPath, req.url)));
    }

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/images")
    ) {
        return setResponseTraceHeader(
            NextResponse.next({
                request: {
                    headers: buildRequestHeaders(),
                },
            })
        );
    }

    const token = getSessionToken(req);
    const session = token ? verifySessionToken(token) : null;
    const isOnboarded = Boolean(session?.isOnboarded);
    const isDashboardPath = APP_PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    const isOnboardingPath = pathname.startsWith(ONBOARDING_PATH);

    if (!session && isProtectedPath(pathname) && !isPublicPath(pathname)) {
        if (isOnboardingPath) {
            edgeLogger.info("request_redirected", {
                requestId,
                reason: "unauthenticated_onboarding",
                from: pathname,
                to: "/login",
            });
            return setResponseTraceHeader(NextResponse.redirect(new URL("/login", req.url)));
        }

        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        edgeLogger.info("request_redirected", {
            requestId,
            reason: "unauthenticated_protected_path",
            from: pathname,
            to: "/login",
        });
        return setResponseTraceHeader(NextResponse.redirect(loginUrl));
    }

    if (session && ["/login", "/signup", "/verification"].includes(pathname)) {
        const destination = isOnboarded ? "/" : ONBOARDING_PATH;
        edgeLogger.info("request_redirected", {
            requestId,
            reason: "authenticated_auth_path",
            from: pathname,
            to: destination,
        });
        return setResponseTraceHeader(NextResponse.redirect(new URL(destination, req.url)));
    }

    if (session && !isOnboarded && isDashboardPath) {
        edgeLogger.info("request_redirected", {
            requestId,
            reason: "onboarding_required",
            from: pathname,
            to: ONBOARDING_PATH,
        });
        return setResponseTraceHeader(NextResponse.redirect(new URL(ONBOARDING_PATH, req.url)));
    }

    if (session && isOnboarded && isOnboardingPath) {
        edgeLogger.info("request_redirected", {
            requestId,
            reason: "already_onboarded",
            from: pathname,
            to: "/",
        });
        return setResponseTraceHeader(NextResponse.redirect(new URL("/", req.url)));
    }

    if (session && isOnboarded && (isDashboardPath || isProtectedPath(pathname))) {
        const status = session.subscriptionStatus;
        const isAllowed = status === "TRIAL" || status === "ACTIVE";

        if (!isAllowed && !pathname.startsWith(BILLING_PATH)) {
            edgeLogger.warn("request_redirected", {
                requestId,
                reason: "inactive_subscription",
                from: pathname,
                to: BILLING_PATH,
                subscriptionStatus: status,
            });
            return setResponseTraceHeader(NextResponse.redirect(new URL(BILLING_PATH, req.url)));
        }
    }

    return setResponseTraceHeader(
        NextResponse.next({
            request: {
                headers: buildRequestHeaders(),
            },
        })
    );
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

