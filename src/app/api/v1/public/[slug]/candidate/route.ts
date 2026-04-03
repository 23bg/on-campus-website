import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { candidateService } from "@/server/candidatesApi"; // Updated service import
import { enforceRateLimit } from "@/lib/utils/rateLimit";
import { env } from "@/lib/config/env";
import { toAppError } from "@/lib/utils/error";
import { createRouteLogger } from "@/lib/api/route-logger";

const candidateSchema = z.object({ // Renamed from leadSchema
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().trim().max(120).email().optional(),
    jobId: z.string().trim().max(120).optional(), // Changed from course to jobId
    message: z.string().trim().max(1024).optional(),
    source: z.string().trim().max(50).optional(),
});

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
    const routeLog = createRouteLogger("/api/v1/public/[slug]/candidate#POST", req); // Updated route path
    try {
        const { slug } = await context.params;
        routeLog.info("public_candidate_submit_started", { slug }); // Updated log message

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const rate = await enforceRateLimit(`candidate:${ip}:${slug}`, env.LEAD_RATE_LIMIT_PER_MIN, 60_000); // Updated rate limit key
        if (!rate.ok) {
            routeLog.warn("public_candidate_submit_rate_limited", { slug, retryAfter: rate.retryAfter }); // Updated log message
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "RATE_LIMITED",
                        message: `Too many submissions. Retry in ${rate.retryAfter}s`,
                    },
                },
                { status: 429 }
            );
        }

        const contentType = req.headers.get("content-type") ?? "";
        let payload: Record<string, string | undefined> = {};

        if (contentType.includes("application/json")) {
            payload = (await req.json()) as Record<string, string | undefined>;
        } else {
            const formData = await req.formData();
            payload = {
                name: formData.get("name")?.toString(),
                phone: formData.get("phone")?.toString(),
                email: formData.get("email")?.toString(),
                jobId: formData.get("jobId")?.toString(), // Changed from course to jobId
                message: formData.get("message")?.toString(),
                source: formData.get("source")?.toString(),
            };
        }

        const input = candidateSchema.parse(payload);
        const candidate = await candidateService.createLeadBySlug(slug, input);

        routeLog.info("public_candidate_submit_succeeded", { slug, instituteId: candidate.instituteId, candidateId: candidate.id });

        if (contentType.includes("application/json")) {
            return NextResponse.json({ success: true, data: candidate });
        }

        return NextResponse.redirect(new URL(`/${slug}/candidate?success=1`, req.url)); // Updated redirect path
    } catch (error) {
        routeLog.error("public_candidate_submit_failed", error); // Updated log message
        const appError = toAppError(error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: appError.code,
                    message: appError.message,
                    details: appError.details,
                },
            },
            { status: appError.statusCode }
        );
    }
}