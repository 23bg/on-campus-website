export default function HowItWorks() {
    const steps = [
        "Capture enquiry",
        "Assign follow-up",
        "Track progress",
        "Convert admission",
        "Manage student",
    ];

    return (
        <section className="w-full border-b bg-muted/50 py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="max-w-2xl space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        One system to manage admissions
                    </h2>
                    <p className="text-sm text-muted-foreground md:text-base">
                        Every team member follows the same structured flow from first enquiry to enrolled student.
                    </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-5">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className="rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
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

