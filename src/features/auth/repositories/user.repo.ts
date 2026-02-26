import { prisma } from "@/lib/db/prisma";

type CreateUserInput = {
    email: string;
    instituteId?: string;
    role?: "OWNER" | "MANAGER" | "VIEWER";
    name?: string;
    emailVerified?: boolean;
    otpPending?: boolean;
    otpHash?: string | null;
    otpResendCount?: number;
    otpExpiresAt?: Date | null;
};

export const userRepository = {
    findById: async (id: string) => prisma.user.findUnique({ where: { id } }),

    findByEmail: async (email: string) =>
        prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        }),

    create: async (input: CreateUserInput) =>
        prisma.user.create({
            data: {
                email: input.email.trim().toLowerCase(),
                instituteId: input.instituteId,
                role: input.role ?? "OWNER",
                name: input.name,
                emailVerified: input.emailVerified ?? false,
                otpPending: input.otpPending ?? false,
                otpHash: input.otpHash,
                otpResendCount: input.otpResendCount,
                otpExpiresAt: input.otpExpiresAt,
            },
        }),

    updateByEmail: async (
        email: string,
        input: {
            instituteId?: string;
            role?: "OWNER" | "MANAGER" | "VIEWER";
            name?: string | null;
            emailVerified?: boolean;
            otpPending?: boolean;
            otpHash?: string | null;
            otpResendCount?: number;
            otpExpiresAt?: Date | null;
        }
    ) =>
        prisma.user.update({
            where: { email: email.trim().toLowerCase() },
            data: input,
        }),

    listByInstitute: async (instituteId: string) =>
        prisma.user.findMany({
            where: { instituteId },
            orderBy: { createdAt: "desc" },
        }),

    updateByIdAndInstitute: async (
        id: string,
        instituteId: string,
        input: { role?: "OWNER" | "MANAGER" | "VIEWER"; name?: string | null }
    ) =>
        prisma.user.updateMany({
            where: { id, instituteId },
            data: input,
        }),

    removeByIdAndInstitute: async (id: string, instituteId: string) =>
        prisma.user.deleteMany({
            where: { id, instituteId },
        }),
};
