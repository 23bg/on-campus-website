"use client"

import {
    Home,
    Building2,
    Users,
    BookOpen,
    Layers,
    IndianRupee,
    UserRound,
    Wallet,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
    SidebarFooter,
} from "@/components/ui/sidebar"

import Link from "next/link"
import ROUTES from "@/constants/routes"
import { NavMain } from "@/components/dashboard/nav-main"
import { usePathname } from "next/navigation"

export function DashboardAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const pathname = usePathname();
    const { state } = useSidebar();

    const withActiveFlag = (items: any[]) =>
        items.map((item) => {
            const isRoot = item.url === "/";

            return {
                ...item,
                isActive: isRoot
                    ? pathname === "/"
                    : pathname === item.url || pathname.startsWith(item.url + "/"),
            };
        });

    const navSections = [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: ROUTES.DASHBOARD.ROOT,
                    icon: Home,
                },
            ],
        },
        {
            title: "Admissions",
            items: [
                {
                    title: "Leads",
                    url: ROUTES.DASHBOARD.LEADS,
                    icon: UserRound,
                },
                {
                    title: "Students",
                    url: ROUTES.DASHBOARD.STUDENTS,
                    icon: UserRound,
                },
            ],
        },
        {
            title: "Academics",
            items: [
                {
                    title: "Courses",
                    url: ROUTES.DASHBOARD.COURSES,
                    icon: BookOpen,
                },
                {
                    title: "Batches",
                    url: ROUTES.DASHBOARD.BATCHES,
                    icon: Layers,
                },
            ],
        },
        {
            title: "Finance",
            items: [
                {
                    title: "Fees",
                    url: ROUTES.DASHBOARD.FEES,
                    icon: IndianRupee,
                },
                {
                    title: "Payments",
                    url: ROUTES.DASHBOARD.PAYMENTS,
                    icon: Wallet,
                },
            ],
        },
        {
            title: "Institute",
            items: [
                {
                    title: "Institute Overview",
                    url: ROUTES.DASHBOARD.INSTITUTE,
                    icon: Building2,
                },
                {
                    title: "Team",
                    url: ROUTES.DASHBOARD.TEAM,
                    icon: Users,
                },
            ],
        },
    ];

    return (
        <Sidebar collapsible='offcanvas' {...props} variant="sidebar" className="h-screen overflow-hidden " >
            <SidebarHeader className="mx-0 px-0 ">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem >
                            <SidebarMenuButton >
                                <Link id="dashboard-brand" href={ROUTES.DASHBOARD.ROOT} className="flex items-center gap-2">
                                    {state === "collapsed" ? (
                                        <span className="text-xl font-semibold text-primary"></span>) : (
                                        <div className="flex items-center gap-2">

                                            <span className="text-xl font-semibold text-primary">OnCampus</span>
                                        </div>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent >
                {navSections.map((section) => (
                    <NavMain
                        key={section.title ?? "primary"}
                        menuTitle={section.title}

                        items={withActiveFlag(section.items)}
                    />
                ))}
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}

