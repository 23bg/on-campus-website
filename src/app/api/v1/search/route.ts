import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookie } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
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

        const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
        if (query.length < 2) {
            return NextResponse.json({
                success: true,
                data: { leads: [], students: [], courses: [] },
            });
        }

        const [leads, students, courses] = await Promise.all([
            prisma.candidate.findMany({
                where: {
                    instituteId: session.instituteId,
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { phone: { contains: query, mode: "insensitive" } },
                        { source: { contains: query, mode: "insensitive" } },
                        { jobId: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
                take: 5,
                select: { id: true, name: true, phone: true, source: true, status: true },
            }),
            prisma.candidate.findMany({
                where: {
                    instituteId: session.instituteId,
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { phone: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
                take: 5,
                select: { id: true, name: true, phone: true, email: true },
            }),
            prisma.job.findMany({
                where: {
                    instituteId: session.instituteId,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
                take: 5,
                select: { id: true, title: true, salary: true },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: { leads, students, courses },
        });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}
