"use client"

import {
    CreditCard,
    UserCircle,
    Home,
    UserRound,
    Users,
    MessageCircle,
    Twitter,
    Linkedin,
    BookOpen,
    Layers,
    IndianRupee,
    Upload,
    AlertTriangle,
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
import Image from "next/image"
import logo from "../../../public/on-campus.png";

export function DashboardAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const pathname = usePathname();
    const { state } = useSidebar();

    const withActiveFlag = (items: any[]) =>
        items.map((item) => {
            const isRoot = item.url === "/dashboard";

            return {
                ...item,
                isActive: isRoot
                    ? pathname === "/dashboard" // Dashboard ONLY active on "/dashboard"
                    : pathname === item.url || pathname.startsWith(item.url + "/"),
            };
        });

    const navItems = [
        {
            title: "Dashboard",
            url: ROUTES.DASHBOARD.ROOT,
            icon: Home,
        },
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
        {
            title: "Teachers",
            url: ROUTES.DASHBOARD.TEACHERS,
            icon: UserRound,
        },
        {
            title: "Fees",
            url: ROUTES.DASHBOARD.FEES,
            icon: IndianRupee,
        },
        {
            title: "Defaulters",
            url: ROUTES.DASHBOARD.DEFAULTERS,
            icon: AlertTriangle,
        },
        {
            title: "Teams",
            url: ROUTES.DASHBOARD.TEAMS,
            icon: Users,
        },
        {
            title: "Profile",
            url: ROUTES.DASHBOARD.PROFILE,
            icon: UserCircle,
        },
        {
            title: "Billing",
            url: ROUTES.DASHBOARD.BILLING,
            icon: CreditCard,
        },
        {
            title: "Upload",
            url: ROUTES.DASHBOARD.UPLOAD,
            icon: Upload,
        },
    ];

    const data = {
        navMain: navItems,
    };

    const socialItems = [
        {
            title: "WhatsApp",
            url: process.env.NEXT_PUBLIC_WHATSAPP || "", // Replace with actual WhatsApp link
            icon: MessageCircle,
        },
        {
            title: "X (Twitter)",
            url: process.env.NEXT_PUBLIC_X || "", // Replace with actual X/Twitter link
            icon: Twitter,
        },
        {
            title: "LinkedIn",
            url: process.env.NEXT_PUBLIC_LINKEDIN || "", // Replace with actual LinkedIn link
            icon: Linkedin,
        },
    ];

    return (
        <Sidebar collapsible="icon" {...props} variant="inset" className="h-screen overflow-hidden " >
            <SidebarHeader className="mx-0 px-0 ">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem >
                            <SidebarMenuButton >
                                <Link href={ROUTES.DASHBOARD.ROOT} className="flex items-center gap-2">
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
            <SidebarContent className="">
                <NavMain menuTitle="Menus" items={withActiveFlag(data.navMain)} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarMenu>
                        {socialItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}

