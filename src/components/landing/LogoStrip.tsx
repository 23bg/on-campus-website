import { cn } from "@/lib/utils";

const logos = [
    "Apex Coaching",
    "Bright Future Academy",
    "Prime NEET Classes",
    "Vertex Tutorials",
    "SkillSprint Institute",
    "Success Point",
    "Pioneer Learning",
    "Scholars Hub",
    "MentorEdge",
    "NextRank Academy",
];

type LogoStripProps = {
    title?: string;
    subtitle?: string;
    compact?: boolean;
};

export default function LogoStrip({
    title = "Trusted by coaching institutes across India",
    subtitle = "50+ institutes • 3,000+ enquiries managed monthly",
    compact = false,
}: LogoStripProps) {
    return (
        <section className={cn("w-full border-b bg-muted/50", compact ? "py-12" : "py-20")}>
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
                    <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {logos.map((logo) => (
                        <div
                            key={logo}
                            className="rounded-lg border border-border bg-muted px-4 py-3 text-center text-xs font-medium text-muted-foreground transition-all duration-200 hover:scale-[1.02] hover:border-primary/40 hover:bg-background hover:text-foreground"
                        >
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
