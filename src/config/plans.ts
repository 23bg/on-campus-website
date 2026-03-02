export type PlanType = "STARTER" | "GROWTH" | "SCALE";

type PlanConfig = {
    key: PlanType;
    name: string;
    priceMonthly: number;
    userLimit: number;
    tagline: string;
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
    STARTER: {
        key: "STARTER",
        name: "Starter",
        priceMonthly: 999,
        userLimit: 1,
        tagline: "For independent institute owners",
    },
    GROWTH: {
        key: "GROWTH",
        name: "Growth",
        priceMonthly: 1999,
        userLimit: 10,
        tagline: "For institutes with admission staff",
    },
    SCALE: {
        key: "SCALE",
        name: "Scale",
        priceMonthly: 4999,
        userLimit: 50,
        tagline: "For larger institutes and organizations",
    },
};

export const DEFAULT_PLAN_TYPE: PlanType = "STARTER";

export const isPlanType = (value: string): value is PlanType =>
    value === "STARTER" || value === "GROWTH" || value === "SCALE";