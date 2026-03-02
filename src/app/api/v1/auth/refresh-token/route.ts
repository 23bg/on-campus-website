import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, verifySessionToken } from "@/lib/auth/auth";
import { createRouteLogger } from "@/lib/api/route-logger";

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/auth/refresh-token#POST", req);
    const token = req.cookies.get("session_token")?.value;

    if (!token) {
        routeLog.warn("refresh_token_missing_session");
        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Missing session" } },
            { status: 401 }
        );
    }

    const session = verifySessionToken(token);
    if (!session) {
        routeLog.warn("refresh_token_invalid_session");
        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Invalid session" } },
            { status: 401 }
        );
    }

    routeLog.info("refresh_token_started", { userId: session.userId, instituteId: session.instituteId });
    const nextToken = createSessionToken(session);
    await setSessionCookie(nextToken);
    routeLog.info("refresh_token_succeeded", { userId: session.userId, instituteId: session.instituteId });

    return NextResponse.json({
        success: true,
        data: { refreshed: true },
    });
}
