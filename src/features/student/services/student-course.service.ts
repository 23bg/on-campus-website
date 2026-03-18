import { z } from "zod";
import { AppError } from "@/lib/utils/error";
import { prisma } from "@/lib/db/prisma";
import { studentCourseRepository } from "@/features/student/repositories/student-course.repo";

const assignSchema = z.object({
    instituteId: z.string().min(1),
    studentId: z.string().min(1),
    courseId: z.string().min(1),
    batchId: z.string().optional(),
    joinedAt: z.string().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "DROPPED"]).optional(),
    createdBy: z.string().optional(),
});

export const studentCourseService = {
    async listStudentCourses(instituteId: string, studentId: string) {
        const [assignments, courses, batches] = await Promise.all([
            studentCourseRepository.listByStudent(instituteId, studentId),
            prisma.course.findMany({ where: { instituteId }, select: { id: true, name: true } }),
            prisma.batch.findMany({ where: { instituteId }, select: { id: true, name: true, startDate: true } }),
        ]);

        const courseMap = new Map(courses.map((course) => [course.id, course.name]));
        const batchMap = new Map(batches.map((batch) => [batch.id, batch]));

        return assignments.map((assignment) => ({
            ...assignment,
            courseName: courseMap.get(assignment.courseId) ?? "Unknown course",
            batchName: assignment.batchId ? (batchMap.get(assignment.batchId)?.name ?? "Unknown batch") : null,
            batchStartDate: assignment.batchId ? (batchMap.get(assignment.batchId)?.startDate ?? null) : null,
        }));
    },

    async assignCourse(payload: unknown) {
        const input = assignSchema.parse(payload);

        const student = await prisma.student.findFirst({ where: { id: input.studentId, instituteId: input.instituteId } });
        if (!student) {
            throw new AppError("Student not found", 404, "STUDENT_NOT_FOUND");
        }

        const course = await prisma.course.findFirst({ where: { id: input.courseId, instituteId: input.instituteId } });
        if (!course) {
            throw new AppError("Course not found", 404, "COURSE_NOT_FOUND");
        }

        if (input.batchId) {
            const batch = await prisma.batch.findFirst({ where: { id: input.batchId, instituteId: input.instituteId } });
            if (!batch) {
                throw new AppError("Batch not found", 404, "BATCH_NOT_FOUND");
            }

            if (batch.courseId !== input.courseId) {
                throw new AppError("Batch does not belong to selected course", 400, "BATCH_COURSE_MISMATCH");
            }
        }

        const duplicate = await studentCourseRepository.findActiveByCourseAndBatch(
            input.instituteId,
            input.studentId,
            input.courseId,
            input.batchId
        );

        if (duplicate) {
            throw new AppError("Student is already assigned to this course and batch", 409, "DUPLICATE_STUDENT_COURSE");
        }

        const assignment = await studentCourseRepository.create({
            instituteId: input.instituteId,
            studentId: input.studentId,
            courseId: input.courseId,
            batchId: input.batchId,
            joinedAt: input.joinedAt ? new Date(input.joinedAt) : undefined,
            status: input.status ?? "ACTIVE",
            createdBy: input.createdBy,
        });

        // Backward compatibility: keep legacy single-course fields aligned with latest active assignment.
        await prisma.student.updateMany({
            where: { id: input.studentId, instituteId: input.instituteId },
            data: { courseId: input.courseId, batchId: input.batchId ?? null },
        });

        return assignment;
    },

    async updateAssignmentStatus(
        instituteId: string,
        assignmentId: string,
        status: "ACTIVE" | "COMPLETED" | "DROPPED"
    ) {
        await studentCourseRepository.updateStatus(instituteId, assignmentId, status);
        return { success: true };
    },
};
