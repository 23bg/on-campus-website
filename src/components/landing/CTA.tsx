import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center md:px-6 lg:py-20">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Start Managing Admissions Professionally.</h2>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild size="lg">
                        <Link href="/signup">Start Free Trial</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/contact">Book Demo</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

