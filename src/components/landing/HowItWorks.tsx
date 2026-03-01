import { useTranslations } from "next-intl";

export default function HowItWorks() {
    const t = useTranslations("howItWorks");
    const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("title")}</h2>
                <div className="mt-8 grid gap-4 md:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={step} className="rounded-lg border p-4">
                            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                                {index + 1}
                            </div>
                            <p className="font-medium">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

