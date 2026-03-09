import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
    title: "Admission CRM for Coaching Institutes",
    description: "OnCampus admission CRM helps coaching institutes capture enquiries and convert them into admissions with structured follow-ups.",
    alternates: { canonical: "/admission-crm" },
    openGraph: {
        title: "Admission CRM for Coaching Institutes",
        description: "OnCampus admission CRM helps coaching institutes capture enquiries and convert them into admissions with structured follow-ups.",
        url: "/admission-crm",
        type: "website",
    },
};

export default function AdmissionCrmPage() {
    return (
        <SeoLandingPage
            title="Admission CRM for Coaching Institutes"
            problem="Leads are scattered across calls, WhatsApp, and sheets, so admissions get delayed and follow-ups are missed."
            solution="OnCampus keeps every enquiry in one structured pipeline so your team can follow up faster and close admissions with visibility."
            features={[
                "Lead capture from forms, QR, and public page",
                "Follow-up tracking and assignment",
                "Admission stage movement with timeline",
                "Duplicate lead checks and activity logs",
            ]}
            faqs={[
                { q: "Can we track every enquiry source?", a: "Yes, you can track source and stage for each enquiry." },
                { q: "Does it work for coaching admissions?", a: "Yes, it is built specifically for coaching institute workflows." },
            ]}
        />
    );
}
