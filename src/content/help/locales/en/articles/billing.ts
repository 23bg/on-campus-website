import type { HelpArticle } from "@/content/help/schema";

export const billingArticle: HelpArticle = {
    slug: "billing",
    locale: "en",
    category: "feesAndBilling",
    title: "Subscription and Billing",
    description: "Understand OnCampus plans, free trial, billing cycle, and how to manage your subscription.",
    overview: "Review plans, trial details, billing options, and upgrade rules for your institute account.",
    lastUpdated: "2026-06-01",
    steps: [
        {
            id: "step1",
            title: "Choose plan",
            description: "Select Starter, Growth, or Scale based on users and WhatsApp alert quota.",
            bullets: [
                "Starter: 1 user, 1,000 alerts/month",
                "Growth: up to 10 users, 3,000 alerts/month",
                "Scale: unlimited users, 10,000 alerts/month",
            ],
        },
        {
            id: "step2",
            title: "Start with trial",
            description: "Use the 14-day trial to validate workflows before paid subscription.",
            bullets: [
                "No card required to start",
                "All core features available during trial",
            ],
        },
        {
            id: "step3",
            title: "Upgrade and manage billing",
            description: "Upgrade anytime from billing settings and apply annual billing when needed.",
            bullets: [
                "Annual billing gives 2 months saving",
                "Plan changes apply immediately",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I pay for my subscription?",
            answer: "Payments are processed via Razorpay using card, UPI, or net banking.",
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes. You can cancel from billing. Access continues until the current cycle ends.",
        },
    ],
    keywords: ["billing", "plans", "trial", "subscription", "razorpay"],
};
