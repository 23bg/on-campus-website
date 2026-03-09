import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
    title: "Coaching Institute CRM",
    description: "OnCampus is a coaching institute CRM that manages enquiries, admissions, students, and fee operations in one platform.",
    alternates: { canonical: "/coaching-institute-crm" },
    openGraph: {
        title: "Coaching Institute CRM",
        description: "OnCampus is a coaching institute CRM that manages enquiries, admissions, students, and fee operations in one platform.",
        url: "/coaching-institute-crm",
        type: "website",
    },
};

export default function CoachingInstituteCrmPage() {
    return (
        <SeoLandingPage
            title="Coaching Institute CRM"
            problem="Institute owners struggle to track admission operations when data is split across disconnected tools."
            solution="OnCampus centralizes coaching CRM workflows from enquiry to enrolled student and fee collection visibility."
            features={[
                "Enquiry pipeline and follow-ups",
                "Student records and batch mapping",
                "Fee plans, installments, and payment logs",
                "Role-based access for admission teams",
            ]}
            faqs={[
                { q: "Is this a school ERP?", a: "No. It is focused on coaching institute admission and student operations." },
                { q: "Can teams work together?", a: "Yes, with roles and shared visibility." },
            ]}
        />
    );
}
