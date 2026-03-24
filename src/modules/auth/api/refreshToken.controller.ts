import { NextResponse } from "next/server";
import { refreshSessionUseCase } from "@/modules/auth/application/refreshSession.useCase";
import { createSessionToken, setSessionCookie } from "@/lib/auth/auth";
import { fail, ok } from "@/modules/auth/api/responses";

export const refreshTokenController = async () => {
    const session = await refreshSessionUseCase();
    if (!session) {
        return NextResponse.json(fail("Invalid session"), { status: 401 });
    }

    await setSessionCookie(
        createSessionToken({
            userId: session.userId,
            email: session.email,
            role: session.role,
            instituteId: session.instituteId,
            isOnboarded: session.isOnboarded,
            subscriptionStatus: session.subscriptionStatus,
        })
    );

    return NextResponse.json(ok({ refreshed: true }));
};
