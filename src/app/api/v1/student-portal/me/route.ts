import { NextResponse } from "next/server";
import { readStudentSessionFromCookie } from "@/lib/auth/student-auth";
import { studentPortalService } from "@/features/student/services/student-portal.service";
import { toAppError } from "@/lib/utils/error";

export async function GET() {
    try {
        const session = await readStudentSessionFromCookie();
        if (!session?.studentId || !session.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        const data = await studentPortalService.getPortalData(session.studentId, session.instituteId);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}
