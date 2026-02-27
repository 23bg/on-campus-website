import { NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";

export async function GET() {
    const session = await readSessionFromCookie();

    if (!session) {
        return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
            { status: 401 }
        );
    }

    const isOnboarded = Boolean(session.isOnboarded);

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
                subscriptionStatus: session.subscriptionStatus,
            },
            gbp: {
                status: "NOT_CONNECTED" as const,
            },
        },
    });
}
