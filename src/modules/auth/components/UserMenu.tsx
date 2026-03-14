"use client";

import { useRouter } from "next/navigation";
import { Building2, CreditCard, LogOut, Palette, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { API } from "@/constants/api";
import ROUTES from "@/constants/routes";

export default function UserMenu() {
    const router = useRouter();

    const logout = async () => {
        try {
            await api.post(API.AUTH.LOG_OUT);
        } catch {
        } finally {
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button aria-label="Open user menu" className="rounded-full focus:outline-none">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>OC</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.PROFILE)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.SETTINGS)}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD.BILLING)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => router.push(`${ROUTES.DASHBOARD.SETTINGS}?tab=appearance`)}>
                    <Palette className="mr-2 h-4 w-4" />
                    Theme / Appearance
                </DropdownMenuItem> */}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
