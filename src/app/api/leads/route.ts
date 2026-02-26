import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { leadService } from "@/features/lead/services/lead.service";
import { toAppError } from "@/lib/utils/error";

export async function GET(req: NextRequest) {
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        const status = req.nextUrl.searchParams.get("status") ?? undefined;
        const query = req.nextUrl.searchParams.get("query") ?? undefined;
        const from = req.nextUrl.searchParams.get("from") ?? undefined;
        const to = req.nextUrl.searchParams.get("to") ?? undefined;

        const data = await leadService.getLeads(session.instituteId, { status, query, from, to });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}
