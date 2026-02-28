import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 lg:py-24">
                <div className="space-y-6">
                    <p className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">OnCampus</p>
                    <h1 className=" text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                        Stop Losing Admission Leads in WhatsApp & Excel.
                    </h1>
                    <div className="font-sans space-y-2 text-lg text-muted-foreground">
                        <p>Admission CRM built for Indian coaching institutes.</p>
                        <p>Collect enquiries. Track leads. Convert admissions.</p>
                        <p>All in one simple system for ₹999/month.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/signup">Start Free Trial</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/contact">Book Demo</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border bg-muted/20 p-3">
                    <Image
                        src="/landing/dashboard-mock.svg"
                        alt="OnCampus dashboard preview"
                        width={900}
                        height={620}
                        priority
                        className="h-auto w-full rounded-lg"
                    />
                </div>
            </div>
        </section>
    );
}

