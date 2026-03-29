import { NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { candidateService } from "@/server/candidatesApi"; // Updated import
import { toAppError } from "@/lib/utils/error";

type RouteContext = {
    params: Promise<{ candidateId: string }>; // Updated to candidateId
};

export async function GET(_: Request, context: RouteContext) {
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        const { candidateId } = await context.params; // Updated to candidateId
        const data = await candidateService.getCandidateTimeline(session.instituteId, candidateId); // Updated service call and id parameter
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}


