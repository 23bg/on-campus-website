import { BookOpenText, GraduationCap, School, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UseCases() {
    const t = useTranslations("useCasesSection");
    const useCases = [
        { title: t("item1Title"), description: t("item1Description"), icon: GraduationCap },
        { title: t("item2Title"), description: t("item2Description"), icon: School },
        { title: t("item3Title"), description: t("item3Description"), icon: BookOpenText },
        { title: t("item4Title"), description: t("item4Description"), icon: Users },
    ];

    return (
        <section className="w-full border-b bg-stone-50/70 py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("title")}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {useCases.map((useCase) => {
                        const Icon = useCase.icon;

                        return (
                            <article
                                key={useCase.title}
                                className="rounded-xl border border-stone-200 bg-background p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                            >
                                <Icon className="h-5 w-5 text-primary" aria-hidden />
                                <h3 className="text-lg font-semibold">{useCase.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{useCase.description}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
