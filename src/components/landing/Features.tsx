import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        title: "Unlimited Leads",
        description: "Capture and track every admission enquiry without feature gating.",
    },
    {
        title: "Public Mini Website",
        description: "Launch your institute profile with courses, contacts, and enquiry CTA.",
    },
    {
        title: "QR Lead Capture",
        description: "Turn posters and handouts into instant enquiry forms with QR.",
    },
    {
        title: "Excel Upload",
        description: "Migrate existing student data quickly and keep records structured.",
    },
    {
        title: "Razorpay Subscription Billing",
        description: "Secure recurring payments with transparent plan management.",
    },
    {
        title: "No Feature Gating",
        description: "Core workflows stay available across plans so teams can scale confidently.",
    },
];

export default function Features() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Core Features That Drive Admissions</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardHeader>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">{feature.description}</CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

