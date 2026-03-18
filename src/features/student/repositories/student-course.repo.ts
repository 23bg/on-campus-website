import { prisma } from "@/lib/db/prisma";
import { withTenantScope } from "@/lib/db/tenant-scope";

type CreateStudentCourseInput = {
    instituteId: string;
    studentId: string;
    courseId: string;
    batchId?: string;
    joinedAt?: Date;
    status?: "ACTIVE" | "COMPLETED" | "DROPPED";
    createdBy?: string;
};

export const studentCourseRepository = {
    create: async (payload: CreateStudentCourseInput) =>
        prisma.studentCourse.create({
            data: {
                instituteId: payload.instituteId,
                studentId: payload.studentId,
                courseId: payload.courseId,
                batchId: payload.batchId,
                joinedAt: payload.joinedAt,
                status: payload.status,
                createdBy: payload.createdBy,
            },
        }),

    listByStudent: async (instituteId: string, studentId: string) =>
        prisma.studentCourse.findMany({
            where: withTenantScope(instituteId, { studentId }),
            orderBy: { joinedAt: "desc" },
        }),

    findActiveByCourseAndBatch: async (
        instituteId: string,
        studentId: string,
        courseId: string,
        batchId?: string
    ) =>
        prisma.studentCourse.findFirst({
            where: withTenantScope(instituteId, {
                studentId,
                courseId,
                batchId: batchId ?? null,
                status: "ACTIVE",
            }),
        }),

    updateStatus: async (
        instituteId: string,
        assignmentId: string,
        status: "ACTIVE" | "COMPLETED" | "DROPPED"
    ) =>
        prisma.studentCourse.updateMany({
            where: { id: assignmentId, instituteId },
            data: { status },
        }),
};
