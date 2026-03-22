export default function Features() {
    const modules = [
        {
            title: "Admission Pipeline",
            items: ["Enquiry capture", "Follow-ups", "Conversion tracking"],
        },
        {
            title: "Student & Courses",
            items: ["Student records", "Batch/course mapping", "Payments"],
        },
        {
            title: "Team Workflow",
            items: ["Assign leads", "Track ownership", "Team visibility"],
        },
        {
            title: "Communication",
            items: ["WhatsApp alerts", "Notifications"],
        },
        {
            title: "Integrations",
            items: ["WhatsApp Business", "Razorpay", "Email"],
        },
    ];

    return (
        <section className="w-full border-b bg-background py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="max-w-2xl space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Product modules built like a system</h2>
                    <p className="text-sm text-muted-foreground md:text-base">
                        OnCampus is organized into structured modules so each team can execute admissions reliably.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {modules.map((module) => (
                        <article
                            key={module.title}
                            className="rounded-xl border border-border bg-muted/50 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <h3 className="text-lg font-semibold">{module.title}</h3>
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                {module.items.map((item) => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

