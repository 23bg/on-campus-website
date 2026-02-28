import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Skill Institute Admission CRM - OnCampus",
    description: "Manage admissions for short-term skill programs with practical tracking in OnCampus.",
};

export default function SkillCentersUseCasePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">For Skill Institutes</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Run admissions for short courses with clear enquiry ownership and follow-up history.</p>
                <p>Track which sources and counselors convert best so efforts stay focused.</p>
                <p>Keep student onboarding details in one place without operational clutter.</p>
            </div>
        </main>
    );
}
