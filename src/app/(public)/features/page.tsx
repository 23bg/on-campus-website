import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ROUTES from "@/constants/routes";

export async function generateMetadata(): Promise<Metadata> {
    const title = "Features | Classes360";
    const description = "System architecture for coaching institute admission operations.";

    return {
        title,
        description,
        alternates: {
            canonical: "/features",
        },
        openGraph: {
            title,
            description,
            url: "/features",
            type: "website",
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
        },
    };
}

export default async function FeaturesPage() {
    const architectureSections = [
        {
            title: "Admission Flow",
            items: ["Capture enquiries", "Assign follow-ups", "Track conversion stages"],
        },
        {
            title: "Student Management",
            items: ["Student records", "Batch and course mapping", "Fee and payment updates"],
        },
        {
            title: "Team Management",
            items: ["Role-based access", "Lead ownership", "Cross-team visibility"],
        },
        {
            title: "Communication",
            items: ["WhatsApp alerts", "Internal notifications", "Follow-up reminders"],
        },
        {
            title: "Integrations",
            items: ["WhatsApp Business", "Razorpay", "Email"],
        },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">System Architecture</p>
                <h1 className="text-4xl font-bold tracking-tight">One architecture for admission operations</h1>
                <p className="text-sm text-muted-foreground md:text-base">
                    Classes360 connects admissions, students, teams, communication, and integrations into one structured
                    workflow.
                </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {architectureSections.map((section) => (
                    <section
                        key={section.title}
                        className="rounded-xl border border-border bg-muted/50 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                    >
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {section.items.map((item) => (
                                <li key={item}>• {item}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <div className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6">
                <h2 className="text-xl font-semibold">Explore core feature modules</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Link
                        href={ROUTES.FEATURE_DETAILS.LEAD_MANAGEMENT}
                        className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    >
                        Lead Management <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                        href={ROUTES.FEATURE_DETAILS.STUDENT_RECORDS}
                        className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    >
                        Student Records <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                        href={ROUTES.FEATURE_DETAILS.PUBLIC_INSTITUTE_PAGE}
                        className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    >
                        Public Institute Page <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                        href={ROUTES.FEATURE_DETAILS.SUBSCRIPTION_BILLING}
                        className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    >
                        Subscription Billing <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </main>
    );
}
