import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Demo() {
    const t = useTranslations("demo");

    return (
        <section className="w-full border-b ">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center md:px-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
                    <p className="mt-3 text-muted-foreground">{t("description")}</p>
                    <Button asChild className="mt-6" variant="outline">
                        <Link href="/demo-institute">{t("cta")}</Link>
                    </Button>
                </div>
                <div className="rounded-xl border bg-muted/20 p-3">
                    <Image
                        src="/landing/demo-mock.svg"
                        alt={t("previewAlt")}
                        width={900}
                        height={620}
                        loading="lazy"
                        className="h-auto w-full rounded-lg"
                    />
                </div>
            </div>
        </section>
    );
}

