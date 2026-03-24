import Link from "next/link";
import { Button } from "@/components/ui/button";

const flowSteps = ["Enquiry", "Follow-up", "Admission", "Student"];

export default function Hero() {
    return (
        <section className="w-full border-b bg-linear-to-b from-secondary to-background py-14 md:py-20">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
                <div className="max-w-2xl space-y-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Admissions Operating System
                    </p>
                    <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                        Turn every enquiry into a tracked admission.
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                        From first enquiry to final admission, manage everything in one system built for coaching
                        institutes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/signup">Start Free Trial</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/contact">View Demo</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-6">
                    <p className="mb-4 text-sm font-semibold text-primary">System flow visual</p>
                    <div className="grid gap-3 md:grid-cols-4 md:items-center md:gap-2">
                        {flowSteps.map((step, index) => (
                            <div key={step} className="flex items-center gap-2 md:contents">
                                <div className="rounded-lg border border-primary/25 bg-background px-4 py-3 text-center text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                                    {step}
                                </div>
                                {index < flowSteps.length - 1 ? (
                                    <span className="text-primary/70 md:mx-auto md:block">→</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                        <p>Capture leads from QR, links, and your website.</p>
                        <p>Track follow-ups, ownership, and conversion status.</p>
                        <p>Move qualified enquiries into confirmed admissions.</p>
                        <p>Manage student records, courses, and payments.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

