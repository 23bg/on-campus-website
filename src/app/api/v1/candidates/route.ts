import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { candidateService } from "@/server/candidatesApi"; // Updated import
import { toAppError } from "@/lib/utils/error";
import { createRouteLogger } from "@/lib/api/route-logger";
import { AppError } from "@/lib/utils/error"; // Added AppError import

export async function GET(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/candidates#GET", req); // Updated route path
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            routeLog.warn("candidates_get_unauthorized"); // Updated log message
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        routeLog.info("candidates_get_started", { userId: session.userId, instituteId: session.instituteId }); // Updated log message

        const status = req.nextUrl.searchParams.get("status") ?? undefined;
        const query = req.nextUrl.searchParams.get("query") ?? undefined;
        const from = req.nextUrl.searchParams.get("from") ?? undefined;
        const to = req.nextUrl.searchParams.get("to") ?? undefined;

        const data = await candidateService.getCandidates(session.instituteId, { status, query, from, to }); // Updated service call
        routeLog.info("candidates_get_succeeded", { userId: session.userId, instituteId: session.instituteId }); // Updated log message
        return NextResponse.json({ success: true, data });
    } catch (error) {
        routeLog.error("candidates_get_failed", error); // Updated log message
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}

export async function POST(req: NextRequest) {
    const routeLog = createRouteLogger("/api/v1/candidates#POST", req); // Updated route path
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            routeLog.warn("candidates_post_unauthorized"); // Updated log message
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        routeLog.info("candidates_post_started", { userId: session.userId, instituteId: session.instituteId }); // Updated log message

        const contentType = req.headers.get("content-type");

        if (contentType?.includes("multipart/form-data")) {
            // Handle import
            const formData = await req.formData();
            const file = formData.get("file") as File;
            const dryRun = formData.get("dryRun") === "true";

            if (!file) {
                throw new AppError("No file uploaded", 400, "NO_FILE_UPLOADED");
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const text = buffer.toString("utf-8");
            const rows = text.split("\n").map((row) => {
                const [name, phone, email, source, jobId, city, message] = row.split(","); // Updated to jobId
                return { name, phone, email, source, jobId, city, message }; // Updated to jobId
            });

            const importSummary = await candidateService.importCandidates(session.instituteId, rows, { dryRun }); // Updated service call
            routeLog.info("candidates_import_succeeded", { userId: session.userId, instituteId: session.instituteId, importSummary }); // Updated log message
            return NextResponse.json({ success: true, data: importSummary });
        } else {
            // Handle single candidate creation
            const body = await req.json();
            const created = await candidateService.createCandidate({ // Updated service call
                instituteId: session.instituteId,
                createdBy: session.userId,
                ...body,
            });
            routeLog.info("candidates_create_succeeded", { userId: session.userId, instituteId: session.instituteId, candidateId: created.id }); // Updated log message
            return NextResponse.json({ success: true, data: created }, { status: 201 });
        }
    } catch (error) {
        routeLog.error("candidates_post_failed", error); // Updated log message
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}


