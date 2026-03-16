export type PlanType = "STARTER" | "TEAM" | "GROWTH" | "SCALE";
export type PricingVersion = "LEGACY" | "CURRENT";

export type PlanPricing = {
    monthly: number;
    yearly: number;
};

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
        priceMonthly: 499,
        priceYearly: 4990,
        userLimit: 1,
        whatsappMonthlyLimit: 30,
        whatsappDailyLimit: 5,
        extraConversationCost: 0,
        tagline: "For independent institute owners",
    },
    TEAM: {
        key: "TEAM",
        name: "Team",
        priceMonthly: 999,
        priceYearly: 9990,
        userLimit: 5,
        whatsappMonthlyLimit: 150,
        whatsappDailyLimit: 20,
        extraConversationCost: 0,
        tagline: "For small institutes with admission staff",
    },
    GROWTH: {
        key: "GROWTH",
        name: "Growth",
        priceMonthly: 1999,
        priceYearly: 19990,
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

// Existing institutes created before this timestamp are grandfathered on legacy prices.
export const PRICING_V2_EFFECTIVE_AT = new Date("2026-03-16T00:00:00+05:30");

export const PLAN_PRICING_LEGACY: Record<PlanType, PlanPricing> = {
    STARTER: { monthly: 399, yearly: 3990 },
    TEAM: { monthly: 899, yearly: 8990 },
    GROWTH: { monthly: 1799, yearly: 17990 },
    SCALE: { monthly: 3999, yearly: 39990 },
};

export const PLAN_PRICING_CURRENT: Record<PlanType, PlanPricing> = {
    STARTER: { monthly: 499, yearly: 4990 },
    TEAM: { monthly: 999, yearly: 9990 },
    GROWTH: { monthly: 1999, yearly: 19990 },
    SCALE: { monthly: 3999, yearly: 39990 },
};

export const AUTOMATION_PACK_PRICING: PlanPricing = {
    monthly: 499,
    yearly: 4990,
};

export const isGrandfatheredSubscription = (createdAt?: Date | null): boolean => {
    if (!createdAt) {
        return false;
    }

    return createdAt.getTime() < PRICING_V2_EFFECTIVE_AT.getTime();
};

export const getPlanPricing = (
    planType: PlanType,
    options?: { grandfathered?: boolean; version?: PricingVersion }
): PlanPricing => {
    const version = options?.version ?? (options?.grandfathered ? "LEGACY" : "CURRENT");
    return version === "LEGACY" ? PLAN_PRICING_LEGACY[planType] : PLAN_PRICING_CURRENT[planType];
};

export const isPlanType = (value: string): value is PlanType =>
    value === "STARTER" || value === "TEAM" || value === "GROWTH" || value === "SCALE";

/** Returns true when the plan has no user-count cap */
export const isUnlimitedUsers = (limit: number | null): boolean => limit === null;