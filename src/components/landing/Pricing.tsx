import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
    "Institute Website",
    "Lead CRM",
    "Students",
    "Teachers",
    "QR Leads",
    "Excel Upload",
];

export default function Pricing() {
    return (
        <section className="w-full border-b " id="pricing">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Pricing</h2>
                <Card className="mx-auto mt-8 max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl">₹999 / month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm font-medium text-muted-foreground">Includes:</p>
                        <ul className="grid gap-2 text-sm text-muted-foreground">
                            {items.map((item) => (
                                <li key={item} className="rounded-md border px-3 py-2">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" size="lg">
                            <Link href="/signup">Start Free Trial</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}

