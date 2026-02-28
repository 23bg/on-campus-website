import { z } from "zod";
import { courseRepository } from "@/features/course/repositories/course.repo";
import { AppError } from "@/lib/utils/error";

const courseInputSchema = z.object({
    instituteId: z.string().min(1),
    name: z.string().trim().min(2, "Course name must be at least 2 characters").max(120, "Course name cannot exceed 120 characters"),
    banner: z.string().trim().max(2048).url().optional().or(z.literal("")),
    duration: z.string().trim().max(120).optional(),
    defaultFees: z.number().min(0).optional(),
    description: z.string().trim().max(1024).optional(),
});

export const courseService = {
    async createCourse(payload: unknown) {
        const input = courseInputSchema.parse(payload);
        return courseRepository.create(input);
    },

    async updateCourse(
        instituteId: string,
        courseId: string,
        payload: { name?: string; banner?: string | null; duration?: string | null; defaultFees?: number | null; description?: string | null }
    ) {
        if (payload.name !== undefined) {
            z.string().trim().min(2).max(120).parse(payload.name);
        }
        if (payload.banner !== undefined && payload.banner !== null && payload.banner !== "") {
            z.string().trim().max(2048).url().parse(payload.banner);
        }
        if (payload.duration !== undefined && payload.duration !== null) {
            z.string().trim().max(120).parse(payload.duration);
        }
        if (payload.description !== undefined && payload.description !== null) {
            z.string().trim().max(1024).parse(payload.description);
        }
        return courseRepository.update(instituteId, courseId, {
            ...payload,
            banner: payload.banner === "" ? null : payload.banner,
        });
    },

    async deleteCourse(instituteId: string, courseId: string) {
        await courseRepository.remove(instituteId, courseId);
        return { success: true };
    },

    async getCourses(instituteId: string) {
        return courseRepository.listByInstitute(instituteId);
    },

    async getCourseById(instituteId: string, courseId: string) {
        const course = await courseRepository.findById(instituteId, courseId);
        if (!course) {
            throw new AppError("Course not found", 404, "COURSE_NOT_FOUND");
        }
        return course;
    },
};
