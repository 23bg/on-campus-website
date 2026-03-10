import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { DEMO_VIDEO_EMBED_URL } from "@/constants/external-links";

export default function Hero() {
    const t = useTranslations("hero");

    return (
        <section className="w-full border-b ">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 lg:py-24">
                <div className="space-y-6">
                    <p className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("label")}</p>
                    <h1 className=" text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                        {t("title")}
                    </h1>
                    <div className="font-sans space-y-2 text-lg text-muted-foreground">
                        <p>{t("subtitleLine1")}</p>
                        <p>{t("subtitleLine2")}</p>
                        <p>{t("subtitleLine3")}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/signup">{t("cta")}</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/contact">{t("secondaryCta")}</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl">
                    <section className="mb-8">
                        <div className="aspect-video overflow-hidden rounded-lg border-0">
                            <iframe
                                src={DEMO_VIDEO_EMBED_URL}
                                title={`Gettting started video tutorial`}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}

