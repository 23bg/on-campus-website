import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, ChartNoAxesCombined, FileSpreadsheet, Funnel } from "lucide-react";

export const metadata: Metadata = {
    title: "Resources - OnCampus",
    description: "Practical resources to improve admission workflows for coaching institutes in India.",
};

const resources = [
    {
        title: "How to increase admissions in coaching institutes",
        category: "Admissions",
        icon: ChartNoAxesCombined,
    },
    {
        title: "How to track leads for tuition classes",
        category: "Lead Management",
        icon: Funnel,
    },
    {
        title: "Excel vs admission management platform for coaching institutes",
        category: "Operations",
        icon: FileSpreadsheet,
    },
    {
        title: "How to build admission funnel for NEET institute",
        category: "Playbook",
        icon: BookOpenCheck,
    },
];

export default function ResourcesPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Resources</p>
                <h1 className="text-4xl font-bold tracking-tight">Practical Guides for Institute Growth</h1>
                <p className="text-sm text-muted-foreground md:text-base">
                    We publish practical playbooks for institute owners and admission teams.
                </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                {resources.map((resource) => {
                    const Icon = resource.icon;

                    return (
                        <article
                            key={resource.title}
                            className="rounded-xl border border-border bg-muted/50 p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                <Icon className="h-3.5 w-3.5" aria-hidden />
                                {resource.category}
                            </div>
                            <h2 className="mt-4 text-lg font-semibold">{resource.title}</h2>
                            <Link
                                href="/help"
                                className="mt-4 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Read guide
                            </Link>
                        </article>
                    );
                })}
            </div>
        </main>
    );
}
