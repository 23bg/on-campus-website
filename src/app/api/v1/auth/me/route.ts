import { NextResponse } from "next/server";
import { createSessionToken, readSessionFromCookie, setSessionCookie } from "@/lib/auth/auth";
import { subscriptionService } from "@/features/subscription/subscriptionApi";
import { createRouteLogger } from "@/lib/api/route-logger";

export async function GET() {
    const routeLog = createRouteLogger("/api/v1/auth/me#GET");
    const session = await readSessionFromCookie();

    if (!session) {
        routeLog.warn("auth_me_unauthorized");
        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
            { status: 401 }
        );
    }

    routeLog.info("auth_me_started", { userId: session.userId, instituteId: session.instituteId });

    const isOnboarded = Boolean(session.isOnboarded);
    const subscription = await subscriptionService.getSubscription(session.instituteId);
    const liveStatus = subscription.status;

    if (liveStatus !== session.subscriptionStatus) {
        const refreshedToken = createSessionToken({
            ...session,
            subscriptionStatus: liveStatus,
        });
        await setSessionCookie(refreshedToken);
        routeLog.info("auth_me_session_refreshed", { userId: session.userId, instituteId: session.instituteId, subscriptionStatus: liveStatus });
    }

    routeLog.info("auth_me_succeeded", { userId: session.userId, instituteId: session.instituteId });

    return NextResponse.json({
        success: true,
        data: {
            user: {
                id: session.userId,
                email: session.email,
                role: session.role,
                emailVerified: true,
            },
            business: {
                exists: isOnboarded,
                status: isOnboarded ? ("ACTIVE" as const) : ("DRAFT" as const),
            },
            institute: {
                id: session.instituteId,
                subscriptionStatus: liveStatus,
            },
            gbp: {
                status: "NOT_CONNECTED" as const,
            },
        },
    });
}

