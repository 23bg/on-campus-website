"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/providers/theme-provider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-muted text-muted-foreground hover:bg-primary-600 hover:text-white"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}
