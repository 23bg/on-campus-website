const solutions = [
    "Capture leads from forms, QR, and shared links",
    "Track every enquiry stage until admission",
    "Keep student records in one clean system",
    "Publish a public institute page in minutes",
    "Run subscription billing with secure Razorpay checkout",
];

export default function Solution() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">One Simple Admission CRM.</h2>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                    {solutions.map((item) => (
                        <li key={item} className="rounded-lg border p-4 text-muted-foreground">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

