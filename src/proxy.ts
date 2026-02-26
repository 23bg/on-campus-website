import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/auth";

const PUBLIC_PATHS = ["/login", "/signup", "/verification", "/pricing", "/demo-institute"];
const DASHBOARD_PATH = "/dashboard";
const ONBOARDING_PATH = "/onboarding";
const BILLING_PATH = "/dashboard/billing";

const isPublicPath = (pathname: string): boolean =>
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

const getSessionToken = (req: NextRequest): string | undefined =>
    req.cookies.get("session_token")?.value || req.cookies.get("access_token")?.value;

const isProtectedPath = (pathname: string): boolean =>
    pathname.startsWith(DASHBOARD_PATH) || pathname.startsWith(ONBOARDING_PATH);

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/images")
    ) {
        return NextResponse.next();
    }

    const token = getSessionToken(req);
    const session = token ? verifySessionToken(token) : null;
    const isOnboarded = Boolean(session?.isOnboarded);
    const isDashboardPath = pathname.startsWith(DASHBOARD_PATH);
    const isOnboardingPath = pathname.startsWith(ONBOARDING_PATH);

    if (session && pathname === "/") {
        return NextResponse.redirect(new URL(isOnboarded ? DASHBOARD_PATH : ONBOARDING_PATH, req.url));
    }

    if (!session && isProtectedPath(pathname) && !isPublicPath(pathname)) {
        if (isOnboardingPath) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (session && ["/login", "/signup", "/verification"].includes(pathname)) {
        return NextResponse.redirect(new URL(isOnboarded ? DASHBOARD_PATH : ONBOARDING_PATH, req.url));
    }

    if (session && !isOnboarded && isDashboardPath) {
        return NextResponse.redirect(new URL(ONBOARDING_PATH, req.url));
    }

    if (session && isOnboarded && isOnboardingPath) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
    }

    if (session && isOnboarded && (isDashboardPath || isProtectedPath(pathname))) {
        const status = session.subscriptionStatus;
        const isAllowed = status === "TRIAL" || status === "ACTIVE";

        if (!isAllowed && !pathname.startsWith(BILLING_PATH)) {
            return NextResponse.redirect(new URL(BILLING_PATH, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

