export type PlanType = "STARTER" | "TEAM" | "GROWTH" | "SCALE";

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
        name: "Solo",
        priceMonthly: 399,
        priceYearly: 3990,
        userLimit: 1,
        whatsappMonthlyLimit: 30,
        whatsappDailyLimit: 5,
        extraConversationCost: 0,
        tagline: "For independent institute owners",
    },
    TEAM: {
        key: "TEAM",
        name: "Team",
        priceMonthly: 899,
        priceYearly: 8990,
        userLimit: 5,
        whatsappMonthlyLimit: 150,
        whatsappDailyLimit: 20,
        extraConversationCost: 0,
        tagline: "For small institutes with admission staff",
    },
    GROWTH: {
        key: "GROWTH",
        name: "Growth",
        priceMonthly: 1799,
        priceYearly: 17990,
        userLimit: 20,
        whatsappMonthlyLimit: 600,
        whatsappDailyLimit: 80,
        extraConversationCost: 0,
        tagline: "For institutes with larger admission teams",
    },
    SCALE: {
        key: "SCALE",
        name: "Scale",
        priceMonthly: 3999,
        priceYearly: 39990,
        userLimit: null,
        whatsappMonthlyLimit: 2000,
        whatsappDailyLimit: 300,
        extraConversationCost: 0,
        tagline: "For large institutes with many counselors",
    },
};

export const DEFAULT_PLAN_TYPE: PlanType = "STARTER";

export const isPlanType = (value: string): value is PlanType =>
    value === "STARTER" || value === "TEAM" || value === "GROWTH" || value === "SCALE";

/** Returns true when the plan has no user-count cap */
export const isUnlimitedUsers = (limit: number | null): boolean => limit === null;