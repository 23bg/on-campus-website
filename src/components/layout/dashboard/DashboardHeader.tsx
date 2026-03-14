"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ImraboChat from "@/modules/ai/components/ImraboChat";
import UserMenu from "@/modules/auth/components/UserMenu";
import GlobalSearch from "@/components/layout/dashboard/GlobalSearch";
import ROUTES from "@/constants/routes";
import { Bell, CircleHelp } from "lucide-react";

const routeLabelMap: Record<string, string> = {
    dashboard: "Dashboard",
    leads: "Leads",
    students: "Students",
    team: "Team",
    courses: "Courses",
    batches: "Batches",
    fees: "Fees",
    payments: "Payments",
    institute: "Institute",
    settings: "Settings",
    billing: "Billing",
    profile: "Profile",
};

const toTitleCase = (value: string) =>
    value
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

export default function DashboardHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = routeLabelMap[segment] ?? toTitleCase(segment);
        return { href, label };
    });

    return (
        <header id="dashboard-header" className="flex h-16 items-center justify-between px-4 border-b bg-background dark:bg-zinc-900/40 backdrop-blur-sm rounded-t-lg">
            <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger />

                <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground truncate">
                    <Link href={ROUTES.DASHBOARD.ROOT} className="hover:text-foreground transition-colors">
                        Dashboard
                    </Link>

                    {crumbs
                        .filter((crumb) => crumb.href !== ROUTES.DASHBOARD.ROOT)
                        .map((crumb, index, arr) => {
                            const isLast = index === arr.length - 1;
                            return (
                                <span key={crumb.href} className="flex items-center gap-2 min-w-0">
                                    <span>/</span>
                                    {isLast ? (
                                        <span className="text-foreground truncate">{crumb.label}</span>
                                    ) : (
                                        <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                                            {crumb.label}
                                        </Link>
                                    )}
                                </span>
                            );
                        })}
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <GlobalSearch />
                <ImraboChat />
                <Button asChild variant="ghost" size="icon" aria-label="Notifications">
                    <Link href="/settings/notifications">
                        <Bell className="h-4 w-4" />
                    </Link>
                </Button>
                <UserMenu />
                <Button asChild variant="ghost" size="icon" aria-label="Help Center">
                    <Link href={ROUTES.HELP}>
                        <CircleHelp className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
