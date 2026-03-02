import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/auth";
import { createRouteLogger } from "@/lib/api/route-logger";

export async function POST() {
    const routeLog = createRouteLogger("/api/v1/auth/logout#POST");
    routeLog.info("logout_started");
    await clearSessionCookie();
    routeLog.info("logout_succeeded");

    return NextResponse.json({
        success: true,
        data: { loggedOut: true },
    });
}
