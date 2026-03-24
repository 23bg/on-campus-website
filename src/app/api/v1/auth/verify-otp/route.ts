import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/authDomainApi";
import { toAppError } from "@/lib/utils/error";
import { createRouteLogger } from "@/lib/api/route-logger";
import { issueSessionForUser } from "@/lib/auth/auth";
import { verifyOtpRequestSchema } from "@/modules/auth/api/schemas";
import { fail, ok } from "@/modules/auth/api/responses";

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/auth/verify-otp#POST", req);
    try {
        const body = await req.json();
        const input = verifyOtpRequestSchema.parse(body);

        routeLog.info("verify_otp_started", { email: input.email });

        const result = await authService.verifyOtp(input);
        await issueSessionForUser(result.userId);

        routeLog.info("verify_otp_succeeded", { email: input.email, userId: result.userId, instituteId: result.instituteId });

        return NextResponse.json(ok(result));
    } catch (error) {
        routeLog.error("verify_otp_failed", error);
        const appError = toAppError(error);
        return NextResponse.json(fail(appError.message), { status: appError.statusCode });
    }
}


