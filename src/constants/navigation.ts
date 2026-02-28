import ROUTES from "@/constants/routes";

export type NavItem = {
    label: string;
    href: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Features", href: ROUTES.FEATURES },
    { label: "Use Cases", href: ROUTES.USE_CASES },
    { label: "Pricing", href: ROUTES.PRICING },
    { label: "Demo", href: ROUTES.DEMO_INSTITUTE },
    { label: "Resources", href: ROUTES.RESOURCES },
];

export const FOOTER_GROUPS: Array<{ title: string; links: NavItem[] }> = [
    {
        title: "Product",
        links: [
            { label: "Features", href: ROUTES.FEATURES },
            { label: "Pricing", href: ROUTES.PRICING },
            { label: "Demo", href: ROUTES.DEMO_INSTITUTE },
        ],
    },
    {
        title: "Use Cases",
        links: [
            { label: "JEE/NEET Institutes", href: "/use-cases/jee-neet-coaching" },
            { label: "Tuition Classes", href: "/use-cases/tuition-classes" },
            { label: "Computer Training Centers", href: "/use-cases/computer-training" },
            { label: "Skill Institutes", href: "/use-cases/skill-centers" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: ROUTES.ABOUT },
            { label: "Contact", href: ROUTES.CONTACT },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: ROUTES.PRIVACY },
            { label: "Terms", href: ROUTES.TERMS },
        ],
    },
];
