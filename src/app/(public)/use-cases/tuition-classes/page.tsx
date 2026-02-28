import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tuition Class Admission CRM - OnCampus",
    description: "Use OnCampus to simplify enquiry handling and admissions for tuition classes.",
};

export default function TuitionUseCasePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">For Tuition Classes</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Handle daily leads from parents and students without juggling multiple spreadsheets.</p>
                <p>Track calls, walk-ins, and follow-ups from first enquiry to confirmed admission.</p>
                <p>Maintain student records and admission status in one practical, easy-to-train workflow.</p>
            </div>
        </main>
    );
}
