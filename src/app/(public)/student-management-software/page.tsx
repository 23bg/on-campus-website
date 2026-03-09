import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";

export const metadata: Metadata = {
    title: "Student Management Software for Coaching Institutes",
    description: "Manage student records, course and batch mapping, fee plans, and student portal updates with OnCampus.",
    alternates: { canonical: "/student-management-software" },
    openGraph: {
        title: "Student Management Software for Coaching Institutes",
        description: "Manage student records, course and batch mapping, fee plans, and student portal updates with OnCampus.",
        url: "/student-management-software",
        type: "website",
    },
};

export default function StudentManagementSoftwarePage() {
    return (
        <SeoLandingPage
            title="Student Management Software for Coaching Institutes"
            problem="After admission, student records, batch details, and fee tracking often become unorganized and hard to maintain."
            solution="OnCampus provides one student management workflow with structured records, mapping, and fee visibility."
            features={[
                "Student profile and admission details",
                "Course and batch assignment",
                "Fee schedule and installment tracking",
                "Student portal access for course information",
            ]}
            faqs={[
                { q: "Can we map students to batches?", a: "Yes, course and batch mapping is built in." },
                { q: "Can students view course info?", a: "Yes, through the student portal." },
            ]}
        />
    );
}
