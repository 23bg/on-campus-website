import Link from "next/link";

import { Button } from "@/components/ui/button";

const plans = [
    { name: "Starter", price: "INR 999/mo", summary: "For solo institute owners" },
    { name: "Team", price: "INR 1,999/mo", summary: "For small admission teams" },
    { name: "Growth", price: "INR 3,499/mo", summary: "For scaling operations" },
];

export default function PricingPreview() {
    return (
        <section className="w-full border-b bg-background py-14 md:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Simple plans for every stage</h2>
                        <p className="text-sm text-muted-foreground md:text-base">
                            Choose a plan based on team size and admissions volume. Upgrade as your institute grows.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/pricing">View full pricing</Link>
                    </Button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="rounded-xl border border-border bg-muted/50 p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <p className="text-sm font-semibold text-primary">{plan.name}</p>
                            <p className="mt-2 text-2xl font-bold">{plan.price}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{plan.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
