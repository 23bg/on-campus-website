import type { HelpArticle } from "@/content/help/schema";

export const whatsappAlertsArticle: HelpArticle = {
    slug: "whatsapp-alerts",
    locale: "en",
    category: "whatsappAndNotifications",
    title: "WhatsApp Alerts in OnCampus",
    description: "Understand how OnCampus sends operational WhatsApp alerts and how plan limits apply.",
    overview: "WhatsApp alerts are system-triggered operational notifications. Manual campaign messaging is not part of the current module.",
    lastUpdated: "2026-06-01",
    steps: [
        {
            id: "step1",
            title: "Understand alert triggers",
            description: "Alerts are sent automatically for operational events.",
            bullets: [
                "New enquiry submission",
                "Follow-up scheduling",
                "Important workflow updates",
            ],
        },
        {
            id: "step2",
            title: "Track plan limits",
            description: "Each plan includes monthly and daily limits for reliable delivery.",
            bullets: [
                "Starter: 1,000 alerts/month",
                "Growth: 2,000 alerts/month",
                "Scale: 5,000 alerts/month",
            ],
        },
        {
            id: "step3",
            title: "Manage overage expectations",
            description: "Extra alerts beyond quota may be charged per message.",
        },
    ],
    faqs: [
        {
            question: "Can institutes manually send WhatsApp messages from OnCampus?",
            answer: "No. Current WhatsApp features are system-generated operational alerts only.",
        },
    ],
    keywords: ["whatsapp", "alerts", "notifications", "limits"],
    featureKey: "whatsapp",
};
