import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/utils/error";
import { eventDispatcherService } from "@/lib/notifications/event-dispatcher.service";

export const studentPortalService = {
    async setCredentials(
        instituteId: string,
        studentId: string,
        payload: { username?: string; email?: string; password: string }
    ) {
        const student = await prisma.student.findFirst({
            where: { id: studentId, instituteId },
            select: { id: true, email: true, name: true, phone: true },
        });

        if (!student) {
            throw new AppError("Student not found", 404, "STUDENT_NOT_FOUND");
        }

        const normalizedUsername = payload.username?.trim().toLowerCase();
        const normalizedEmail = payload.email?.trim().toLowerCase() ?? student.email?.toLowerCase();

        if (!normalizedUsername && !normalizedEmail) {
            throw new AppError("Username or email is required", 400, "INVALID_PORTAL_CREDENTIALS");
        }

        if (!payload.password || payload.password.trim().length < 6) {
            throw new AppError("Password must be at least 6 characters", 400, "INVALID_PASSWORD");
        }

        const passwordHash = await bcrypt.hash(payload.password, 10);
        await prisma.student.updateMany({
            where: { id: student.id, instituteId },
            data: {
                portalUsername: normalizedUsername,
                portalEmail: normalizedEmail,
                portalPasswordHash: passwordHash,
                portalActive: true,
            },
        });

        const message = `Portal credentials set for student ${student.name}. Student can now log in to the portal.`;

        await eventDispatcherService.dispatch({
            event: "STUDENT_PORTAL_CREDENTIALS_CREATED",
            instituteId,
            studentId: student.id,
            message,
            whatsappPhoneNumber: student.phone,
            emailTo: student.email ? [student.email] : undefined,
            link: "/student",
            metadata: { studentId: student.id },
        });

        return { success: true };
    },

    async login(identifier: string, password: string) {
        const normalizedIdentifier = identifier.trim().toLowerCase();
        if (!normalizedIdentifier || !password) {
            throw new AppError("Username/email and password are required", 400, "INVALID_CREDENTIALS");
        }

        const account = await prisma.student.findFirst({
            where: {
                portalActive: true,
                OR: [{ portalUsername: normalizedIdentifier }, { portalEmail: normalizedIdentifier }],
            },
            select: {
                instituteId: true,
                id: true,
                portalPasswordHash: true,
            },
        });

        if (!account || !account.portalPasswordHash) {
            throw new AppError("Invalid login credentials", 401, "INVALID_CREDENTIALS");
        }

        const valid = await bcrypt.compare(password, account.portalPasswordHash);
        if (!valid) {
            throw new AppError("Invalid login credentials", 401, "INVALID_CREDENTIALS");
        }

        const student = await prisma.student.findFirst({
            where: { id: account.id, instituteId: account.instituteId },
            select: { id: true, name: true, instituteId: true },
        });

        if (!student) {
            throw new AppError("Student not found", 404, "STUDENT_NOT_FOUND");
        }

        await eventDispatcherService.dispatch({
            event: "PORTAL_LOGIN",
            instituteId: student.instituteId,
            studentId: student.id,
            message: "Login successful.",
            link: "/student",
            metadata: { studentId: student.id },
        });

        return {
            studentId: student.id,
            instituteId: student.instituteId,
            name: student.name,
        };
    },

    async getPortalData(studentId: string, instituteId: string) {
        const student = await prisma.student.findFirst({
            where: { id: studentId, instituteId },
        });

        if (!student) {
            throw new AppError("Student not found", 404, "STUDENT_NOT_FOUND");
        }

        const [course, batch, institute, notifications] = await Promise.all([
            student.courseId
                ? prisma.course.findFirst({
                    where: { id: student.courseId, instituteId },
                    select: { id: true, name: true, duration: true, description: true },
                })
                : Promise.resolve(null),
            student.batchId
                ? prisma.batch.findFirst({
                    where: { id: student.batchId, instituteId },
                    select: { id: true, name: true, startDate: true },
                })
                : Promise.resolve(null),
            prisma.institute.findFirst({
                where: { id: instituteId },
                select: { id: true, name: true },
            }),
            prisma.studentNotification.findMany({
                where: { studentId },
                orderBy: { createdAt: "desc" },
                take: 30,
            }),
        ]);

        const announcements = (await prisma.studentAnnouncement.findMany({
            where: {
                instituteId,
                OR: [{ batchId: null }, { batchId: student.batchId }],
            },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
                title: true,
                body: true,
                createdAt: true,
            },
        })).map((item) => ({
            title: item.title,
            body: item.body,
            createdAt: item.createdAt.toISOString(),
        }));

        return {
            student: {
                ...student,
                course,
                batch,
                institute,
            },
            announcements,
            notifications,
        };
    },

    async createAnnouncement(
        instituteId: string,
        payload: { title: string; body: string; batchId?: string | null }
    ) {
        if (!payload.title.trim() || !payload.body.trim()) {
            throw new AppError("Title and body are required", 400, "INVALID_ANNOUNCEMENT");
        }

        await prisma.studentAnnouncement.create({
            data: {
                instituteId,
                batchId: payload.batchId ?? null,
                title: payload.title.trim(),
                body: payload.body.trim(),
            },
        });

        await eventDispatcherService.dispatch({
            event: "ANNOUNCEMENT_CREATED",
            instituteId,
            batchId: payload.batchId ?? null,
            title: payload.title.trim(),
            message: payload.body.trim(),
            link: "/student/announcements",
            metadata: { batchId: payload.batchId ?? null },
        });

        await eventDispatcherService.dispatch({
            event: "NEW_ANNOUNCEMENT_AVAILABLE",
            instituteId,
            batchId: payload.batchId ?? null,
            title: payload.title.trim(),
            message: payload.body.trim(),
            link: "/student/announcements",
            metadata: { batchId: payload.batchId ?? null },
        });

        return { success: true };
    },
};
