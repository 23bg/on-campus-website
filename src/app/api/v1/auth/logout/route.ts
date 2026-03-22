import { NextResponse } from "next/server";
import { readAccessTokenFromCookie, clearAuthCookies } from "@/lib/auth/tokens";
import { clearSessionCookie } from "@/lib/auth/auth";
import { createRouteLogger } from "@/lib/api/route-logger";

export async function POST() {
    const routeLog = createRouteLogger("/api/v1/auth/logout#POST");
    try {
        routeLog.info("logout_started");

        // Read access token to get userId for revocation
        const session = await readAccessTokenFromCookie();

        // Clear new auth cookies (access + refresh tokens)
        await clearAuthCookies();

        // Also clear legacy session cookie for backward compatibility
        await clearSessionCookie();

        // TODO: Increment user.tokenVersion in DB to revoke all refresh tokens
        // This ensures any leaked refresh tokens can't create new access tokens
        /*
        if (session) {
            await db.user.update({
                where: { id: session.userId },
                data: { tokenVersion: { increment: 1 } },
            });
        }
        */

        routeLog.info("logout_succeeded", { userId: session?.userId });

        return NextResponse.json({
            success: true,
            data: { loggedOut: true },
        });
    } catch (error) {
        routeLog.error("logout_failed", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
