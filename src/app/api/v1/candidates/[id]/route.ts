import { NextRequest, NextResponse } from "next/server";
import type { CandidateStatus } from "@prisma/client";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { canWriteInstituteData } from "@/lib/auth/permissions";
import { candidateService } from "@/server/candidatesApi"; // Updated import
import { toAppError } from "@/lib/utils/error";

type RouteContext = {
    params: Promise<{ candidateId: string }>; // Updated to candidateId
};

export async function PATCH(req: NextRequest, context: RouteContext) {
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        if (!canWriteInstituteData(session.role)) {
            return NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
                { status: 403 }
            );
        }

        const { candidateId } = await context.params; // Updated to candidateId
        const body = (await req.json()) as { status?: CandidateStatus; message?: string | null; followUpAt?: string | null };

        if (!body.status && body.message === undefined && body.followUpAt === undefined) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_PAYLOAD", message: "status, message, or followUpAt is required" } },
                { status: 400 }
            );
        }

        const data = await candidateService.updateCandidate(session.instituteId, candidateId, { // Updated service call and id parameter
            status: body.status,
            message: body.message,
            followUpAt: body.followUpAt,
        });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}


