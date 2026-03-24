import { NextResponse } from "next/server";
import { fail } from "@/modules/auth/api/responses";
import { refreshTokenController } from "@/modules/auth/api/refreshToken.controller";

/**
 * POST /api/v1/auth/refresh
 * Refresh the access token using the refresh token
 */
export async function POST() {
    try {
        return await refreshTokenController();
    } catch (error) {
        console.error("[auth/refresh]", error);
        return NextResponse.json(fail("Internal server error"), { status: 500 });
    }
}
