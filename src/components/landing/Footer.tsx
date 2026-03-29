import Link from "next/link";
import { FOOTER_GROUPS } from "@/constants/navigation";
import { Linkedin, Twitter, MessageCircle, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
    const year = new Date().getFullYear();
    const t = useTranslations("footer");
    const safeT = (key: string) => {
        try {
            return t(key, { default: key });
        } catch (error) {
            console.error("TRANSLATION KEY:", key, error);
            return key;
        }
    };

    return (
        <footer className="w-full bg-background">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <Card className="border-border bg-card">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
                            {/* Brand Column */}
                            <div className="space-y-6 lg:col-span-2">
                                <div>
                                    <p className="text-xl font-semibold tracking-tight text-foreground">{safeT("brand")}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{safeT("tagline")}</p>
                                </div>
                                {/* Trust Badges */}
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span>🇮🇳</span>
                                        <span>{safeT("builtInIndia")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>{safeT("security")}</span>
                                    </div>
                                </div>
                                {/* Social Icons */}
                                <div className="flex items-center gap-4 pt-2">
                                    <Link
                                        href={process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/91XXXXXXXXXX"}
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        <MessageCircle size={18} />
                                    </Link>
                                    <Link
                                        href={process.env.NEXT_PUBLIC_LINKEDIN || "https://www.linkedin.com/company/your-company"}
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        <Linkedin size={18} />
                                    </Link>
                                    <Link
                                        href={process.env.NEXT_PUBLIC_X || "https://x.com/yourhandle"}
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        <Twitter size={18} />
                                    </Link>
                                </div>
                                <p className="pt-4 text-xs text-muted-foreground">{t("copyright", { year })}</p>
                            </div>
                            {/* Dynamic Footer Groups */}
                            {FOOTER_GROUPS.map((group) => (
                                <nav key={group.titleKey} className="space-y-4 text-sm">
                                    <p className="text-lg font-medium text-foreground">{safeT(group.titleKey)}</p>
                                    <ul className="space-y-2">
                                        {group.links.map((item) => (
                                            <li key={`${item.href}-${item.labelKey}`}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-foreground transition-all"
                                                >
                                                    {safeT(item.labelKey)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </footer>
    );
}