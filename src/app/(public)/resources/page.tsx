import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resources - OnCampus",
    description: "Practical resources to improve admission workflows for coaching institutes in India.",
};

const resources = [
    "How to increase admissions in coaching institutes",
    "How to track leads for tuition classes",
    "Excel vs CRM for coaching institutes",
    "How to build admission funnel for NEET institute",
];

export default function ResourcesPage() {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Resources</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Practical Guides for Institute Growth</h1>
                <p className="text-muted-foreground">
                    We publish practical playbooks for institute owners and admission teams.
                </p>
            </div>

            <ul className="mt-8 space-y-3">
                {resources.map((title) => (
                    <li key={title} className="rounded-lg border p-4 text-sm text-muted-foreground">
                        {title}
                    </li>
                ))}
            </ul>
        </main>
    );
}
