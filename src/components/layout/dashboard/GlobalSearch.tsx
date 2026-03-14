"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PlusCircle, UserPlus, HandCoins, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import api from "@/lib/axios";
import { API } from "@/constants/api";
import ROUTES from "@/constants/routes";

type SearchResults = {
    leads: Array<{ id: string; name: string; phone: string; course?: string | null; status: string }>;
    students: Array<{ id: string; name: string; phone: string; email?: string | null }>;
    courses: Array<{ id: string; name: string; duration?: string | null }>;
};

const EMPTY_RESULTS: SearchResults = {
    leads: [],
    students: [],
    courses: [],
};

export default function GlobalSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);

    const hasAnyResult = useMemo(
        () => results.leads.length > 0 || results.students.length > 0 || results.courses.length > 0,
        [results]
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        if (!open || query.trim().length < 2) {
            setResults(EMPTY_RESULTS);
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const response = await api.get(`${API.INTERNAL.SEARCH}?q=${encodeURIComponent(query.trim())}`);
                setResults(response.data?.data ?? EMPTY_RESULTS);
            } catch {
                setResults(EMPTY_RESULTS);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [open, query]);

    const navigateTo = (href: string) => {
        setOpen(false);
        router.push(href);
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className="hidden md:flex h-9 w-48 items-center justify-between px-3 text-muted-foreground"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center justify-center gap-3">
                    <Search className="h-4 w-4" />
                    <span>Search...</span>
                </div>

            </Button>

            {/* <Button asChild variant="ghost" size="icon" aria-label="Notifications" onClick={() => setOpen(true)}>
                <Search className="h-4 w-4" />
            </Button> */}

            <CommandDialog
                open={open}
                onOpenChange={(nextOpen) => {
                    setOpen(nextOpen);
                    if (!nextOpen) setQuery("");
                }}
                title="Global Search"
                description="Search across pages, leads, students, courses, and quick actions"
            >
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search leads, students, courses..."
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? "Searching..." : "No results found."}
                    </CommandEmpty>

                    <CommandGroup heading="Pages">
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.ROOT)}>Dashboard</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.LEADS)}>Leads</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.STUDENTS)}>Students</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.COURSES)}>Courses</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.BATCHES)}>Batches</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.FEES)}>Fees</CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.PAYMENTS)}>Payments</CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => navigateTo(`${ROUTES.DASHBOARD.LEADS}?focus=recent`)}>
                            <PlusCircle className="h-4 w-4" />
                            Add Lead
                        </CommandItem>
                        <CommandItem onSelect={() => navigateTo(`${ROUTES.DASHBOARD.STUDENTS}?action=add`)}>
                            <UserPlus className="h-4 w-4" />
                            Add Student
                        </CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.FEES)}>
                            <HandCoins className="h-4 w-4" />
                            Record Payment
                        </CommandItem>
                        <CommandItem onSelect={() => navigateTo(ROUTES.DASHBOARD.BATCHES)}>
                            <Layers className="h-4 w-4" />
                            Create Batch
                        </CommandItem>
                    </CommandGroup>

                    {query.trim().length >= 2 ? (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Leads">
                                {results.leads.map((lead) => (
                                    <CommandItem
                                        key={`lead-${lead.id}`}
                                        onSelect={() => navigateTo(`${ROUTES.DASHBOARD.LEADS}?query=${encodeURIComponent(lead.phone || lead.name)}`)}
                                    >
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <span>{lead.name}</span>
                                            <span className="text-xs text-muted-foreground">{lead.status}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                            <CommandGroup heading="Students">
                                {results.students.map((student) => (
                                    <CommandItem
                                        key={`student-${student.id}`}
                                        onSelect={() => navigateTo(`${ROUTES.DASHBOARD.STUDENTS}?query=${encodeURIComponent(student.phone || student.name)}`)}
                                    >
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <span>{student.name}</span>
                                            <span className="text-xs text-muted-foreground">{student.phone}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                            <CommandGroup heading="Courses">
                                {results.courses.map((course) => (
                                    <CommandItem
                                        key={`course-${course.id}`}
                                        onSelect={() => navigateTo(`${ROUTES.DASHBOARD.COURSES}?query=${encodeURIComponent(course.name)}`)}
                                    >
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <span>{course.name}</span>
                                            <span className="text-xs text-muted-foreground">{course.duration || "Duration not set"}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    ) : null}

                    <CommandSeparator />
                    <CommandGroup heading="Help">
                        <CommandItem onSelect={() => navigateTo(ROUTES.HELP)}>Open Help Center</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
