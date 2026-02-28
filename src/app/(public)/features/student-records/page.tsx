import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Records - OnCampus",
    description: "Maintain complete student records in one place after admission conversion.",
};

export default function StudentRecordsFeaturePage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Student Records</h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
                <p>Store student information and admission details in a structured, searchable format.</p>
                <p>Map students to courses and batches without spreadsheet sprawl.</p>
                <p>Improve daily operations by keeping records clean, centralized, and team-accessible.</p>
            </div>
        </main>
    );
}
