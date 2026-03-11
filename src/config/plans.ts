export type PlanType = "STARTER" | "GROWTH" | "SCALE";

type PlanConfig = {
    key: PlanType;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    /** null means unlimited */
    userLimit: number | null;
    whatsappMonthlyLimit: number;
    whatsappDailyLimit: number;
    /** cost in INR per extra conversation over monthly limit */
    extraConversationCost: number;
    tagline: string;
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
    STARTER: {
        key: "STARTER",
        name: "Starter",
        priceMonthly: 999,
        priceYearly: 9990,
        userLimit: 1,
        whatsappMonthlyLimit: 1000,
        whatsappDailyLimit: 100,
        extraConversationCost: 0.70,
        tagline: "For independent institute owners",
    },
    GROWTH: {
        key: "GROWTH",
        name: "Growth",
        priceMonthly: 1999,
        priceYearly: 19990,
        userLimit: 10,
        whatsappMonthlyLimit: 2000,
        whatsappDailyLimit: 300,
        extraConversationCost: 0.60,
        tagline: "For institutes with admission staff",
    },
    SCALE: {
        key: "SCALE",
        name: "Scale",
        priceMonthly: 3999,
        priceYearly: 39990,
        userLimit: null,
        whatsappMonthlyLimit: 5000,
        whatsappDailyLimit: 500,
        extraConversationCost: 0.50,
        tagline: "For large admission teams",
    },
};

export const DEFAULT_PLAN_TYPE: PlanType = "STARTER";

export const isPlanType = (value: string): value is PlanType =>
    value === "STARTER" || value === "GROWTH" || value === "SCALE";

/** Returns true when the plan has no user-count cap */
export const isUnlimitedUsers = (limit: number | null): boolean => limit === null;