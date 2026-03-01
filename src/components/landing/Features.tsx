import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function Features() {
    const t = useTranslations("featuresSection");
    const features = [
        { title: t("item1Title"), description: t("item1Description") },
        { title: t("item2Title"), description: t("item2Description") },
        { title: t("item3Title"), description: t("item3Description") },
        { title: t("item4Title"), description: t("item4Description") },
        { title: t("item5Title"), description: t("item5Description") },
        { title: t("item6Title"), description: t("item6Description") },
    ];

    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardHeader>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">{feature.description}</CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

