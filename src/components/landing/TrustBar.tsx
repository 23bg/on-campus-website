import { Database, ShieldCheck, WalletCards, XCircle } from "lucide-react";

const trustItems = [
    { icon: XCircle, text: "No commission" },
    { icon: WalletCards, text: "Cancel anytime" },
    { icon: ShieldCheck, text: "Secure payments" },
    { icon: Database, text: "Data ownership" },
];

type TrustBarProps = {
    compact?: boolean;
};

export default function TrustBar({ compact = false }: TrustBarProps) {
    return (
        <section className={compact ? "w-full border-b bg-background py-8" : "w-full border-b bg-background py-14"}>
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {trustItems.map(({ icon: Icon, text }) => (
                        <div
                            key={text}
                            className="rounded-lg border border-stone-200 bg-stone-50/70 px-4 py-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                            <span className="inline-flex items-center gap-2 text-sm font-medium">
                                <Icon className="h-4 w-4 text-primary" aria-hidden />
                                {text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
