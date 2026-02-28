const problems = [
    "Leads get buried in WhatsApp chats",
    "No visibility on conversion rate",
    "Follow-ups get missed during busy days",
    "No centralized student data",
    "No proper reporting for admissions",
];

export default function Problem() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Running Your Institute on Excel & WhatsApp?</h2>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                    {problems.map((item) => (
                        <li key={item} className="rounded-lg border p-4 text-muted-foreground">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

