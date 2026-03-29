export type PlanType = "FREE" | "BASIC" | "PRO";

export type PlanConfig = {
    key: PlanType;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    /** null means unlimited */
    userLimit: number | null;
    jobLimit: number | null;
    tagline: string;
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
    FREE: {
        key: "FREE",
        name: "Free",
        priceMonthly: 0,
        priceYearly: 0,
        userLimit: 1,
        jobLimit: 3,
        tagline: "Start with up to 3 jobs and 1 user for free",
    },
    BASIC: {
        key: "BASIC",
        name: "Basic",
        priceMonthly: 499,
        priceYearly: 4990,
        userLimit: 3,
        jobLimit: 10,
        tagline: "Manage up to 10 jobs and small teams efficiently",
    },
    PRO: {
        key: "PRO",
        name: "Pro",
        priceMonthly: 999,
        priceYearly: 9990,
        userLimit: 10,
        jobLimit: null,
        tagline: "Unlimited jobs and high-growth hiring for teams",
    },
};

export const DEFAULT_PLAN_TYPE: PlanType = "FREE";

// Compatibility mapping for existing legacy plan types (transitional logic).
export const LEGACY_PLAN_TYPE_MAP: Record<"STARTER" | "TEAM" | "GROWTH" | "SCALE", PlanType> = {
    STARTER: "FREE",
    TEAM: "BASIC",
    GROWTH: "PRO",
    SCALE: "PRO",
};

export const mapLegacyPlanType = (legacyPlanType: string | null | undefined): PlanType => {
    if (legacyPlanType === "STARTER") return "FREE";
    if (legacyPlanType === "TEAM") return "BASIC";
    if (legacyPlanType === "GROWTH") return "PRO";
    if (legacyPlanType === "SCALE") return "PRO";
    return DEFAULT_PLAN_TYPE;
};

export type PlanPricing = {
    monthly: number;
    yearly: number;
};

export const isPlanType = (value: string): value is PlanType =>
    value === "FREE" || value === "BASIC" || value === "PRO";

export const assertPlanType = (plan: string): PlanType => {
    if (!isPlanType(plan)) {
        throw new Error(`Invalid plan type: ${plan}`);
    }
    return plan;
};

export const isGrandfatheredSubscription = (_createdAt?: Date | null): boolean => {
    // As per new ATS pricing model, grandfathering is deprecated.
    return false;
};

export const getPlanPricing = (
    planType: PlanType,
    options?: { grandfathered?: boolean; version?: string }
): PlanPricing => {
    const plan = PLAN_CONFIG[planType];
    return {
        monthly: plan.priceMonthly,
        yearly: plan.priceYearly,
    };
};

export const canCreateJob = (plan: PlanConfig, currentJobs: number): boolean => {
    if (plan.jobLimit === null) return true;
    return currentJobs < plan.jobLimit;
};

export const canAddUser = (plan: PlanConfig, currentUsers: number): boolean => {
    if (plan.userLimit === null) return true;
    return currentUsers < plan.userLimit;
};

export const isJobLimitReached = (plan: PlanConfig, currentJobs: number): boolean => {
    if (plan.jobLimit === null) return false;
    return currentJobs >= plan.jobLimit;
};
