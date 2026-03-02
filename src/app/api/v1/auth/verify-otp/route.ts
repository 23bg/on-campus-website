import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/services/auth.service";
import { toAppError } from "@/lib/utils/error";
import { verifyOtpValidation } from "@/validations/auth.validation";
import { createRouteLogger } from "@/lib/api/route-logger";

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/auth/verify-otp#POST", req);
    try {
        const body = await req.json();
        const input = verifyOtpValidation.parse(body);

        routeLog.info("verify_otp_started", { email: input.email });

        const result = await authService.verifyOtp(input);

        routeLog.info("verify_otp_succeeded", { email: input.email, userId: result.userId, instituteId: result.instituteId });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        routeLog.error("verify_otp_failed", error);
        const appError = toAppError(error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: appError.code,
                    message: appError.message,
                },
            },
            { status: appError.statusCode }
        );
    }
}

