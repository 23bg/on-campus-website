export type PlanType = "SOLO" | "TEAM";

type PlanConfig = {
    key: PlanType;
    name: string;
    priceMonthly: number;
    userLimit: number;
    tagline: string;
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
    SOLO: {
        key: "SOLO",
        name: "Starter System",
        priceMonthly: 999,
        userLimit: 1,
        tagline: "For independent institute owners",
    },
    TEAM: {
        key: "TEAM",
        name: "Growth System",
        priceMonthly: 1999,
        userLimit: 5,
        tagline: "For admission teams and counselors",
    },
};

export const DEFAULT_PLAN_TYPE: PlanType = "SOLO";

export const isPlanType = (value: string): value is PlanType => value === "SOLO" || value === "TEAM";