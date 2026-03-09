import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ROUTES from "@/constants/routes";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("pages");
    const title = t("featuresMetaTitle");
    const description = t("featuresMetaDescription");

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
    const t = await getTranslations("featuresPage");

    const featureSections = [
        {
            title: "section1Title",
            items: ["section1Item1", "section1Item2", "section1Item3"],
        },
        {
            title: "section2Title",
            items: ["section2Item1", "section2Item2", "section2Item3"],
        },
        {
            title: "section3Title",
            items: ["section3Item1", "section3Item2", "section3Item3"],
        },
        {
            title: "section4Title",
            items: ["section4Item1", "section4Item2", "section4Item3"],
        },
        {
            title: "section5Title",
            items: ["section5Item1", "section5Item2", "section5Item3"],
        },
        {
            title: "section6Title",
            items: ["section6Item1", "section6Item2", "section6Item3"],
        },
    ];

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 lg:py-16">
            <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("label")}</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
                <p className="max-w-3xl text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featureSections.map((section) => (
                    <section key={section.title} className="rounded-xl border bg-muted/20 p-5">
                        <h2 className="text-lg font-semibold">{t(section.title)}</h2>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            {section.items.map((item) => (
                                <li key={item}>• {t(item)}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <div className="mt-10 grid gap-3 rounded-xl border p-5 md:grid-cols-2">
                <Link href={ROUTES.FEATURE_DETAILS.LEAD_MANAGEMENT} className="text-sm text-muted-foreground hover:text-foreground">{t("linkLeadManagement")}</Link>
                <Link href={ROUTES.FEATURE_DETAILS.STUDENT_RECORDS} className="text-sm text-muted-foreground hover:text-foreground">{t("linkStudentRecords")}</Link>
                <Link href={ROUTES.FEATURE_DETAILS.PUBLIC_INSTITUTE_PAGE} className="text-sm text-muted-foreground hover:text-foreground">{t("linkPublicInstitutePage")}</Link>
                <Link href={ROUTES.FEATURE_DETAILS.SUBSCRIPTION_BILLING} className="text-sm text-muted-foreground hover:text-foreground">{t("linkSubscriptionBilling")}</Link>
            </div>
        </main>
    );
}
