import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_CONFIG } from "@/config/plans";

const sharedItems = ["Institute Website", "Lead CRM", "Students", "Teachers", "QR Leads", "Excel Upload"];

const faqs = [
    {
        q: "Can I upgrade from SOLO to TEAM later?",
        a: "Yes, you can upgrade any time from billing.",
    },
    {
        q: "What happens if I exceed my user limit?",
        a: "You can keep working, but adding new users requires an upgrade.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes, both plans include a free trial period.",
    },
];

export default function Pricing() {
    return (
        <section className="w-full border-b bg-muted/40" id="pricing">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="space-y-3 text-center">
                        <h2 className="text-3xl font-semibold">Simple, Transparent Pricing</h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            One clear plan structure for coaching institutes. No hidden fees. Cancel anytime.
                        </p>
                    </div>

                    <div className="mt-8 rounded-md border bg-background p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="rounded-md">
                                <CardHeader>
                                    <CardTitle className="text-4xl font-semibold">₹{PLAN_CONFIG.SOLO.priceMonthly}</CardTitle>
                                    <p className="text-xs text-muted-foreground">SOLO • 1 user / month</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm font-medium text-muted-foreground">Includes:</p>
                                    <ul className="grid gap-2 text-sm text-muted-foreground">
                                        {sharedItems.map((item) => (
                                            <li key={`solo-${item}`} className="rounded-md border px-3 py-2">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="h-9 w-full px-4" size="default" variant="outline">
                                        <Link href="/signup">Start Solo Trial</Link>
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="rounded-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <CardTitle className="text-4xl font-semibold">₹{PLAN_CONFIG.TEAM.priceMonthly}</CardTitle>
                                        <Badge>Recommended</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">TEAM • Up to 5 users / month</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm font-medium text-muted-foreground">Includes:</p>
                                    <ul className="grid gap-2 text-sm text-muted-foreground">
                                        {sharedItems.map((item) => (
                                            <li key={`team-${item}`} className="rounded-md border px-3 py-2">
                                                {item}
                                            </li>
                                        ))}
                                        <li className="rounded-md border px-3 py-2">Team collaboration (up to 5 users)</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="h-9 w-full px-4" size="default">
                                        <Link href="/signup">Start Team Trial</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4">
                        <h3 className="text-xl font-semibold">Frequently asked questions</h3>
                        {faqs.map((item) => (
                            <div key={item.q} className="rounded-md border bg-background p-6">
                                <p className="text-base font-medium">{item.q}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

