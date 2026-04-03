import { prisma } from "@/lib/db/prisma";

export const whatsappAccountRepository = {
    getByInstituteId: async (instituteId: string) =>
        prisma.whatsAppAccount.findUnique({ where: { instituteId } }),

    upsertPending: async (
        instituteId: string,
        phoneNumber: string,
        otp: { otpHash: string; otpExpiresAt: Date; otpRequestedAt: Date }
    ) =>
        prisma.whatsAppAccount.upsert({
            where: { instituteId },
            create: {
                instituteId,
                phoneNumber,
                otpHash: otp.otpHash,
                otpExpiresAt: otp.otpExpiresAt,
                otpRequestedAt: otp.otpRequestedAt,
                otpAttempts: 0,
                status: "PENDING",
                connectedAt: null,
            },
            update: {
                phoneNumber,
                otpHash: otp.otpHash,
                otpExpiresAt: otp.otpExpiresAt,
                otpRequestedAt: otp.otpRequestedAt,
                otpAttempts: 0,
                status: "PENDING",
                phoneNumberId: null,
                businessAccountId: null,
                connectedAt: null,
            },
        }),

    incrementOtpAttempts: async (instituteId: string) =>
        prisma.whatsAppAccount.update({
            where: { instituteId },
            data: { otpAttempts: { increment: 1 } },
        }),

    markVerified: async (instituteId: string) =>
        prisma.whatsAppAccount.update({
            where: { instituteId },
            data: {
                status: "VERIFIED",
                otpHash: null,
                otpExpiresAt: null,
                otpRequestedAt: null,
                otpAttempts: 0,
            },
        }),

    activate: async (instituteId: string, input: { phoneNumberId: string; businessAccountId: string }) =>
        prisma.whatsAppAccount.update({
            where: { instituteId },
            data: {
                phoneNumberId: input.phoneNumberId,
                businessAccountId: input.businessAccountId,
                status: "ACTIVE",
                connectedAt: new Date(),
            },
        }),

    disconnect: async (instituteId: string) =>
        prisma.whatsAppAccount.updateMany({
            where: { instituteId },
            data: {
                status: "DISCONNECTED",
            },
        }),

    markFailed: async (instituteId: string) =>
        prisma.whatsAppAccount.updateMany({
            where: { instituteId },
            data: {
                status: "FAILED",
            },
        }),
};
