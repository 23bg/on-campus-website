"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CoursesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const halfScreen = window.innerHeight / 1;
      setShowHeader(scrollPosition > halfScreen);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {/* Scroll-Triggered Header */}
      <header
        className={`fixed top-0 w-full bg-white shadow-sm border-b py-4 px-4 sm:px-6 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xl font-bold text-green-500">On Campus</div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Input
              placeholder="Search courses..."
              className="w-full sm:w-64"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="w-full sm:w-auto">
                Login
              </Button>
              <Button className="w-full sm:w-auto">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 px-4 sm:px-6 text-sm text-muted-foreground text-center">
        <Separator className="mb-2" />
        © {new Date().getFullYear()} OnCampus Learning. All rights reserved.
      </footer>

      {/* Hover Help Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="fixed bottom-6 right-6 p-3 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg transition-colors z-50"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help? Contact support or check our FAQ.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
