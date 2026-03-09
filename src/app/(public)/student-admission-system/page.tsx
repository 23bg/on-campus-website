import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
    title: "Student Admission System for Coaching Institutes",
    description: "OnCampus student admission system helps institutes convert enquiries, create student records, assign courses, and track fees.",
    alternates: { canonical: "/student-admission-system" },
    openGraph: {
        title: "Student Admission System for Coaching Institutes",
        description: "OnCampus student admission system helps institutes convert enquiries, create student records, assign courses, and track fees.",
        url: "/student-admission-system",
        type: "website",
    },
};

export default function StudentAdmissionSystemPage() {
    return (
        <SeoLandingPage
            title="Student Admission System for Coaching Institutes"
            problem="When admissions are handled manually, institutes miss follow-ups and struggle to maintain complete student records."
            solution="OnCampus provides a student admission system that connects enquiry tracking, admissions, records, course mapping, and fees."
            features={[
                "End-to-end enquiry to admission flow",
                "Student profile creation at admission",
                "Course and batch linkage",
                "Installment and payment status tracking",
            ]}
            faqs={[
                { q: "Does this include fee tracking?", a: "Yes, fee plans, installments, and payment records are included." },
                { q: "Can this replace Excel and WhatsApp tracking?", a: "Yes, that is a core use case for OnCampus." },
            ]}
        />
    );
}
