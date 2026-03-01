import { NextRequest, NextResponse } from "next/server";
import { studentPortalService } from "@/features/student/services/student-portal.service";
import { createStudentSessionToken, setStudentSessionCookie } from "@/lib/auth/student-auth";
import { toAppError } from "@/lib/utils/error";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { identifier?: string; password?: string };
        const session = await studentPortalService.login(body.identifier ?? "", body.password ?? "");
        const token = createStudentSessionToken(session);
        await setStudentSessionCookie(token);
        return NextResponse.json({ success: true, data: session });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}
