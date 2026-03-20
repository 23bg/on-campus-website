export default function Problem() {
    return (
        <section className="w-full border-b bg-background py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="max-w-2xl space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Stop managing admissions across WhatsApp, Excel, and notebooks.
                    </h2>
                    <p className="text-sm text-muted-foreground md:text-base">
                        Replace fragmented workflows with one structured system that your full team can follow.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <article className="rounded-xl border border-stone-200 bg-stone-100/60 p-6 opacity-75">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-600">Before</p>
                        <h3 className="mt-2 text-lg font-semibold">WhatsApp + Excel</h3>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li>• Follow-ups scattered across personal chats</li>
                            <li>• Duplicate entries in multiple sheets</li>
                            <li>• No clear ownership between counselors</li>
                            <li>• Enquiries lost during peak admission months</li>
                        </ul>
                    </article>

                    <article className="rounded-xl border border-primary/35 bg-primary/5 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">After</p>
                        <h3 className="mt-2 text-lg font-semibold">OnCampus System</h3>
                        <ul className="mt-4 space-y-2 text-sm text-foreground">
                            <li>• Every enquiry captured in one pipeline</li>
                            <li>• Follow-ups assigned with clear accountability</li>
                            <li>• Team-level visibility across each stage</li>
                            <li>• Admission outcomes tracked end-to-end</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    );
}

