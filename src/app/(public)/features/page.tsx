import type { Metadata } from "next";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export const metadata: Metadata = {
    title: "Features - OnCampus",
    description: "Explore OnCampus features for leads, students, fees, payments, and institute public pages.",
};

const featureSections = [
    {
        title: "Leads",
        items: ["Online enquiry form", "Lead tracking", "Follow-ups and notes"],
    },
    {
        title: "Students",
        items: ["Student database", "Course and batch mapping", "CSV import"],
    },
    {
        title: "Fees",
        items: ["Fee plans", "Installments", "Defaulters tracking"],
    },
    {
        title: "Website",
        items: ["Institute public page", "Contact and profile details", "Course showcase"],
    },
    {
        title: "Payments",
        items: ["Payment entry", "Payment history", "Date and method filters"],
    },
    {
        title: "Operations",
        items: ["Dashboard today overview", "Team roles", "Billing status visibility"],
    },
];

export default function FeaturesPage() {
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 lg:py-16">
            <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Features</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Everything your institute needs to run daily operations.</h1>
                <p className="max-w-3xl text-muted-foreground">
                    Track every enquiry from first call to admission with a simple workflow built for Indian coaching institutes.
                </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featureSections.map((section) => (
                    <section key={section.title} className="rounded-xl border bg-muted/20 p-5">
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {section.items.map((item) => (
                                <li key={item}>• {item}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <div className="mt-10 grid gap-3 rounded-xl border p-5 md:grid-cols-2">
                <Link href={ROUTES.FEATURE_DETAILS.LEAD_MANAGEMENT} className="text-sm text-muted-foreground hover:text-foreground">Lead Management</Link>
                <Link href={ROUTES.FEATURE_DETAILS.STUDENT_RECORDS} className="text-sm text-muted-foreground hover:text-foreground">Student Records</Link>
                <Link href={ROUTES.FEATURE_DETAILS.PUBLIC_INSTITUTE_PAGE} className="text-sm text-muted-foreground hover:text-foreground">Public Institute Page</Link>
                <Link href={ROUTES.FEATURE_DETAILS.SUBSCRIPTION_BILLING} className="text-sm text-muted-foreground hover:text-foreground">Subscription Billing</Link>
            </div>
        </main>
    );
}
