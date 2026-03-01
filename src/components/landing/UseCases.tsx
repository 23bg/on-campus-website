import { useTranslations } from "next-intl";

export default function UseCases() {
    const t = useTranslations("useCasesSection");
    const useCases = [
        { title: t("item1Title"), description: t("item1Description") },
        { title: t("item2Title"), description: t("item2Description") },
        { title: t("item3Title"), description: t("item3Description") },
        { title: t("item4Title"), description: t("item4Description") },
    ];

    return (
        <section className="w-full border-b">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {useCases.map((useCase) => (
                        <article key={useCase.title} className="rounded-lg border p-5">
                            <h3 className="text-lg font-semibold">{useCase.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{useCase.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
