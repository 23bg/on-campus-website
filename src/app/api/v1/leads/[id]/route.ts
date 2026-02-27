import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { leadService } from "@/features/lead/services/lead.service";
import { toAppError } from "@/lib/utils/error";

type RouteContext = {
    params: Promise<{ id: string }>;
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

        const { id } = await context.params;
        const body = (await req.json()) as { status?: string };

        if (!body.status) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_STATUS", message: "status is required" } },
                { status: 400 }
            );
        }

        const data = await leadService.updateLeadStatus(session.instituteId, id, body.status);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}
