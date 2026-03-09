import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("pages");
    const title = t("contactMetaTitle");
    const description = t("contactMetaDescription");

    return {
        title,
        description,
        alternates: {
            canonical: "/contact",
        },
        openGraph: {
            title,
            description,
            url: "/contact",
            type: "website",
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
        },
    };
}

export default async function ContactPage() {
    const tCommon = await getTranslations("common");
    const t = await getTranslations("contactPage");

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 lg:py-16">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
            <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-muted-foreground">{tCommon("email")}</p>
                    <p className="mt-1 font-medium">{t("emailValue")}</p>
                </div>
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-muted-foreground">{tCommon("whatsApp")}</p>
                    <p className="mt-1 font-medium">{t("whatsAppValue")}</p>
                </div>
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-muted-foreground">{tCommon("supportHours")}</p>
                    <p className="mt-1 font-medium">{t("supportHoursValue")}</p>
                </div>
            </div>
        </main>
    );
}
