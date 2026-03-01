import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function CTA() {
    const t = useTranslations("cta");

    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center md:px-6 lg:py-20">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h2>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild size="lg">
                        <Link href="/signup">{t("primary")}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/contact">{t("secondary")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

