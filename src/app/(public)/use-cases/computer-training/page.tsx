import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Computer Training CRM - OnCampus",
    description: "Admission workflow for computer training centers with structured lead tracking.",
};

export default function ComputerTrainingUseCasePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">For Computer Training Centers</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Organize enquiries by course and batch so counsellors can respond faster.</p>
                <p>Track admissions and pending decisions with clear daily visibility.</p>
                <p>Move from fragmented records to one system for lead-to-student conversion.</p>
            </div>
        </main>
    );
}
