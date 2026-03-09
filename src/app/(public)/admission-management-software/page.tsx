import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
    title: "Admission Management Software",
    description: "OnCampus admission management software helps coaching institutes run enquiry, follow-up, and admission operations in one platform.",
    alternates: { canonical: "/admission-management-software" },
    openGraph: {
        title: "Admission Management Software",
        description: "OnCampus admission management software helps coaching institutes run enquiry, follow-up, and admission operations in one platform.",
        url: "/admission-management-software",
        type: "website",
    },
};

export default function AdmissionManagementSoftwarePage() {
    return (
        <SeoLandingPage
            title="Admission Management Software"
            problem="Admission teams lose time and revenue when follow-ups and lead status are not centralized."
            solution="OnCampus standardizes admission management from first enquiry to confirmed student with clear status and ownership."
            features={[
                "Public lead capture forms",
                "Follow-up reminders and notes",
                "Admission funnel visibility",
                "Conversion tracking by team",
            ]}
            faqs={[
                { q: "Can we track admission stages?", a: "Yes, each enquiry can be moved through stages until admission." },
                { q: "Is it easy for non-technical teams?", a: "Yes, the interface is simple and operations-focused." },
            ]}
        />
    );
}
