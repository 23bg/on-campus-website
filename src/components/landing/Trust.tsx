import { ShieldCheck, Building2, CreditCard, MessageSquareQuote } from "lucide-react";

const items = [
    { icon: Building2, label: "Early access institutes onboarded in Pune" },
    { icon: CreditCard, label: "Secure recurring payments via Razorpay" },
    { icon: ShieldCheck, label: "Institute data handled with role-based access" },
    { icon: MessageSquareQuote, label: "Currently onboarding partner institutes" },
];

export default function Trust() {
    return (
        <section className="w-full border-b ">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trusted by Early-Stage Institutes</h2>
                    <p className="text-muted-foreground">Built in India for practical coaching operations.</p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {items.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 rounded-lg border p-4 text-sm font-medium">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

