import { Quote } from "lucide-react";

const testimonials = [
    {
        institute: "Apex JEE Academy",
        role: "Owner",
        quote: "Before Classes360, we lost 30% enquiries. Now every enquiry has a clear follow-up owner.",
    },
    {
        institute: "FutureRank Classes",
        role: "Admin",
        quote: "Our team moved from spreadsheets to a single workflow. Admissions are now tracked end-to-end.",
    },
    {
        institute: "Nucleus Learning Hub",
        role: "Owner",
        quote: "We scaled counselling operations without chaos. Visibility across team members improved immediately.",
    },
];

export default function Testimonials() {
    return (
        <section className="w-full border-b bg-muted/50 py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="max-w-2xl space-y-3">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Results from real institutes</h2>
                    <p className="text-sm text-muted-foreground md:text-base">
                        Teams choose Classes360 for operational clarity, faster follow-ups, and predictable admissions execution.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {testimonials.map((item) => (
                        <article
                            key={item.institute}
                            className="rounded-xl border border-border bg-background p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <Quote className="h-5 w-5 text-primary" aria-hidden />
                            <p className="mt-4 text-sm leading-6 text-foreground">"{item.quote}"</p>
                            <div className="mt-5 border-t pt-3">
                                <p className="text-sm font-semibold">{item.institute}</p>
                                <p className="text-xs text-muted-foreground">{item.role}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
