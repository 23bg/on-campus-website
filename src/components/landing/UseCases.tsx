const useCases = [
    {
        title: "NEET / JEE Coaching",
        description: "Track high-volume enquiries by source and follow up consistently until admissions close.",
    },
    {
        title: "Tuition Classes",
        description: "Organize daily walk-ins and calls in one lead pipeline without juggling multiple spreadsheets.",
    },
    {
        title: "Computer Training Institutes",
        description: "Manage course-wise enquiries and student records with clear conversion visibility.",
    },
    {
        title: "Skill Academies",
        description: "Run practical admission operations for short-term programs with a simple team workflow.",
    },
];

export default function UseCases() {
    return (
        <section className="w-full border-b">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Built for Real Institute Workflows</h2>
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
