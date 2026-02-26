import { prisma } from "@/lib/db/prisma";

export const subscriptionRepository = {
    createTrial: async (instituteId: string) =>
        prisma.subscription.upsert({
            where: { instituteId },
            create: {
                instituteId,
                status: "TRIAL",
            },
            update: {},
        }),

    findByInstituteId: async (instituteId: string) =>
        prisma.subscription.findUnique({
            where: { instituteId },
        }),

    findByRazorpaySubId: async (razorpaySubId: string) =>
        prisma.subscription.findFirst({
            where: { razorpaySubId },
        }),

    updateByInstituteId: async (
        instituteId: string,
        payload: {
            status?: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
            currentPeriodEnd?: Date | null;
            razorpaySubId?: string | null;
        }
    ) =>
        prisma.subscription.update({
            where: { instituteId },
            data: payload,
        }),

    upsertByRazorpaySubId: async (
        razorpaySubId: string,
        instituteId: string,
        payload: {
            status?: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
            currentPeriodEnd?: Date | null;
        }
    ) =>
        prisma.subscription.upsert({
            where: { instituteId },
            create: {
                instituteId,
                razorpaySubId,
                status: payload.status ?? "TRIAL",
                currentPeriodEnd: payload.currentPeriodEnd,
            },
            update: {
                razorpaySubId,
                status: payload.status,
                currentPeriodEnd: payload.currentPeriodEnd,
            },
        }),

    updateByRazorpaySubId: async (
        razorpaySubId: string,
        payload: {
            status?: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
            currentPeriodEnd?: Date | null;
        }
    ) =>
        prisma.subscription.updateMany({
            where: { razorpaySubId },
            data: payload,
        }),
};
