import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lead Management - OnCampus",
    description: "Track every admission enquiry from first touchpoint to final enrollment.",
};

export default function LeadManagementFeaturePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Lead Management</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Capture enquiries from forms, links, and QR flows in one unified pipeline.</p>
                <p>Move leads across stages, assign follow-ups, and track conversion outcomes clearly.</p>
                <p>Get practical visibility for owners without complex CRM setup.</p>
            </div>
        </main>
    );
}
