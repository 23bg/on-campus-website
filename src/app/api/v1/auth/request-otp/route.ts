import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/features/auth/services/auth.service";
import { toAppError } from "@/lib/utils/error";
import { createRouteLogger } from "@/lib/api/route-logger";

const schema = z.object({
    email: z.email(),
});

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/auth/request-otp#POST", req);
    try {
        const body = await req.json();
        const input = schema.parse(body);
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        routeLog.info("request_otp_started", { email: input.email, ip });

        const result = await authService.requestOtp({ email: input.email, ip });

        routeLog.info("request_otp_succeeded", { email: input.email });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        routeLog.error("request_otp_failed", error);
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

