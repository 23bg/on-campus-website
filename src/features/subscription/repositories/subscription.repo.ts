import { prisma } from "@/lib/db/prisma";
import { DEFAULT_PLAN_TYPE, PLAN_CONFIG, PlanType } from "@/config/plans";

const mapPlanTypeToDb = (planType: PlanType) => {
    // Prisma enum currently uses SOLO/TEAM. Map app-level plans to DB enum.
    switch (planType) {
        case "STARTER":
            return "SOLO" as const;
        case "GROWTH":
        case "SCALE":
            return "TEAM" as const;
        default:
            return "SOLO" as const;
    }
};

export const subscriptionRepository = {
    createTrial: async (instituteId: string, planType: PlanType = DEFAULT_PLAN_TYPE) =>
        prisma.subscription.upsert({
            where: { instituteId },
            create: {
                instituteId,
                planType: mapPlanTypeToDb(planType),
                userLimit: PLAN_CONFIG[planType].userLimit,
                status: "TRIAL",
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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
            trialEndsAt?: Date | null;
            planType?: PlanType;
            userLimit?: number;
        }
    ) =>
        prisma.subscription.update({
            where: { instituteId },
            data: {
                ...payload,
                ...(payload.planType ? { planType: mapPlanTypeToDb(payload.planType) } : {}),
            } as any,
        }),

    upsertByRazorpaySubId: async (
        razorpaySubId: string,
        instituteId: string,
        payload: {
            status?: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
            currentPeriodEnd?: Date | null;
            trialEndsAt?: Date | null;
            planType?: PlanType;
            userLimit?: number;
        }
    ) =>
        prisma.subscription.upsert({
            where: { instituteId },
            create: {
                instituteId,
                razorpaySubId,
                planType: mapPlanTypeToDb(payload.planType ?? DEFAULT_PLAN_TYPE),
                userLimit: payload.userLimit ?? PLAN_CONFIG[payload.planType ?? DEFAULT_PLAN_TYPE].userLimit,
                status: payload.status ?? "TRIAL",
                currentPeriodEnd: payload.currentPeriodEnd,
                trialEndsAt: payload.trialEndsAt,
            },
            update: {
                razorpaySubId,
                status: payload.status,
                currentPeriodEnd: payload.currentPeriodEnd,
                trialEndsAt: payload.trialEndsAt,
                ...(payload.planType ? { planType: mapPlanTypeToDb(payload.planType) } : {}),
                userLimit: payload.userLimit,
            },
        }),

    updateByRazorpaySubId: async (
        razorpaySubId: string,
        payload: {
            status?: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
            currentPeriodEnd?: Date | null;
            trialEndsAt?: Date | null;
        }
    ) =>
        prisma.subscription.updateMany({
            where: { razorpaySubId },
            data: payload,
        }),
};
