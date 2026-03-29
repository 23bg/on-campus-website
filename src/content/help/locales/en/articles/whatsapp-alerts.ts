import type { HelpArticle } from "@/content/help/schema";

export const whatsappAlertsArticle: HelpArticle = {
    slug: "whatsapp-alerts",
    locale: "en",
    category: "whatsappAndNotifications",
    title: "WhatsApp Alerts in OnCampus",
    description: "Understand the two WhatsApp modes in OnCampus and how Meta billing works for institute-owned numbers.",
    overview: "OnCampus supports staff-focused system alerts and optional institute-owned WhatsApp automation for student communication.",
    lastUpdated: "2026-03-15",
    steps: [
        {
            id: "step1",
            title: "Mode 1: OnCampus system alerts",
            description: "Operational alerts are sent to institute staff from the OnCampus system number.",
            bullets: [
                "New enquiry submission",
                "Follow-up scheduling",
                "Payment received and important workflow updates",
            ],
        },
        {
            id: "step2",
            title: "Mode 2: Institute WhatsApp integration",
            description: "Institutes can connect their own WhatsApp Business number for student-facing automation.",
            bullets: [
                "Enquiry confirmation",
                "Demo and follow-up reminders",
                "Payment reminders and admission updates",
            ],
        },
        {
            id: "step3",
            title: "Understand WhatsApp billing",
            description: "Meta conversation charges are billed directly to the institute for institute-owned WhatsApp messages.",
        },
    ],
    faqs: [
        {
            question: "Can institutes manually send WhatsApp messages from OnCampus?",
            answer: "OnCampus focuses on automation templates and operational notifications rather than manual campaigns.",
        },
        {
            question: "Does OnCampus charge per WhatsApp message?",
            answer: "No WhatsApp message quota is applied in pricing plans. Meta conversation charges are billed directly to the institute when using its own WhatsApp Business account.",
        },
    ],
    keywords: ["whatsapp", "alerts", "notifications", "integration", "meta billing"],
    featureKey: "whatsapp",
};
