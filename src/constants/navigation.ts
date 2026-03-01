import ROUTES from "@/constants/routes";

export type NavItem = {
    labelKey: string;
    href: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { labelKey: "home", href: ROUTES.HOME },
    { labelKey: "features", href: ROUTES.FEATURES },
    { labelKey: "pricing", href: ROUTES.PRICING },
    { labelKey: "demo", href: ROUTES.DEMO_INSTITUTE },
    { labelKey: "useCases", href: ROUTES.USE_CASES },
    { labelKey: "resources", href: ROUTES.RESOURCES },
];

export const FOOTER_GROUPS: Array<{ titleKey: string; links: NavItem[] }> = [
    {
        titleKey: "groupProduct",
        links: [
            { labelKey: "features", href: ROUTES.FEATURES },
            { labelKey: "pricing", href: ROUTES.PRICING },
            { labelKey: "demo", href: ROUTES.DEMO_INSTITUTE },
        ],
    },
    {
        titleKey: "groupUseCases",
        links: [
            { labelKey: "jeeNeetInstitutes", href: "/use-cases/jee-neet-coaching" },
            { labelKey: "tuitionClasses", href: "/use-cases/tuition-classes" },
            { labelKey: "computerTrainingCenters", href: "/use-cases/computer-training" },
            { labelKey: "skillInstitutes", href: "/use-cases/skill-centers" },
        ],
    },
    {
        titleKey: "groupCompany",
        links: [
            { labelKey: "about", href: ROUTES.ABOUT },
            { labelKey: "contact", href: ROUTES.CONTACT },
        ],
    },
    {
        titleKey: "groupLegal",
        links: [
            { labelKey: "privacyPolicy", href: ROUTES.PRIVACY },
            { labelKey: "terms", href: ROUTES.TERMS },
        ],
    },
];
