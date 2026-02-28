import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JEE / NEET Coaching CRM - OnCampus",
    description: "Manage high-volume admissions for JEE and NEET coaching centers using OnCampus.",
};

export default function JeeNeetUseCasePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">For JEE / NEET Coaching Institutes</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Track large enquiry volumes from campaigns, referrals, and walk-ins in one pipeline.</p>
                <p>Never miss follow-ups during admission season with clear stage tracking per counsellor.</p>
                <p>Convert more serious prospects by moving from ad-hoc WhatsApp tracking to structured CRM flow.</p>
            </div>
        </main>
    );
}
