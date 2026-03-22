import { NextRequest, NextResponse } from "next/server";
import {
    readRefreshTokenFromCookie,
    createAccessToken,
    setAccessTokenCookie,
    verifyRefreshToken,
} from "@/lib/auth/tokens";

/**
 * POST /api/v1/auth/refresh
 * Refresh the access token using the refresh token
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Read refresh token from cookie
        const refreshTokenCookie = req.cookies.get("refresh_token")?.value;
        if (!refreshTokenCookie) {
            return NextResponse.json({ error: "No refresh token" }, { status: 401 });
        }

        // 2. Verify it's valid
        const refreshPayload = verifyRefreshToken(refreshTokenCookie);
        if (!refreshPayload) {
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
        }

        // 3. Check tokenVersion hasn't changed (revocation check)
        // NOTE: This requires a DB call. You'll need to add this based on your ORM
        // For now, we assume the refresh token is valid if it verifies
        // TODO: Import and check user.tokenVersion matches refreshPayload.tokenVersion
        /*
        const user = await db.user.findUnique({
            where: { id: refreshPayload.userId },
        });

        if (!user || user.tokenVersion !== refreshPayload.tokenVersion) {
            // Token was revoked → force re-login
            return NextResponse.json({ error: "Token revoked" }, { status: 401 });
        }
        */

        // 4. Create new access token
        // TODO: Fetch user data from DB and include in token
        // For now, you'll need to add the user lookup:
        /*
        const newAccessPayload: AccessTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            instituteId: user.instituteId,
            isOnboarded: user.institute.isOnboarded,
            subscriptionStatus: user.institute.subscriptionStatus,
        };
        */

        // Placeholder - error out for now until DB is integrated
        return NextResponse.json(
            { error: "Token refresh not yet fully implemented. Please log in again." },
            { status: 503 }
        );

        // 5. Set new access token cookie (uncomment after implementing DB lookup above)
        // await setAccessTokenCookie(newAccessToken);
        // return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[auth/refresh]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
