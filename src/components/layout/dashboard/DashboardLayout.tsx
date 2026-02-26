"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardAppSidebar } from "@/components/dashboard/side-bar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/theme-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider className="rounded overflow-hidden h-screen">
            <DashboardAppSidebar />

            <SidebarInset className="border shadow-xl bg-background ">

                {/* HEADER */}
                <header className="
                    flex h-16 items-center justify-between px-4
                    border-b bg-background dark:bg-zinc-900/40
                    backdrop-blur-sm rounded-t-xl
                ">
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                        {/* SEARCH BAR */}
                        <Button
                            variant="outline"
                            className="
                                text-muted-foreground bg-muted rounded-full
                                hover:bg-primary-600 hover:text-white px-10
                                flex items-center gap-2
                            "
                        >
                            <Search className="h-4 w-4" />
                            <span className="pr-12">Type to search...</span>
                        </Button>

                        {/* THEME TOGGLE */}
                        <ThemeToggle />
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="overflow-hidden">
                    <div className="h-screen">
                        <ScrollArea className="h-full">
                            {children}
                        </ScrollArea>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="
                    border-t bg-background dark:bg-zinc-900/40
                    backdrop-blur-sm rounded-b-2xl
                ">
                    <div className="
                        flex flex-col sm:flex-row justify-between items-center
                        gap-2 px-6 py-3 text-xs text-muted-foreground
                    ">
                        <span>©2026 OnCampus, built for modern coaching institutes.</span>

                        <div className="flex gap-3">
                            <Link href="#" className="hover:text-primary transition">License</Link>
                            <Link href="#" className="hover:text-primary transition">More Themes</Link>
                            <Link href="#" className="hover:text-primary transition">Documentation</Link>
                            <Link href="#" className="hover:text-primary transition">Support</Link>
                        </div>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}

