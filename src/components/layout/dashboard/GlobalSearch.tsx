"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { API } from "@/constants/api";

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
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);

    const hasAnyResult = useMemo(
        () => results.leads.length > 0 || results.students.length > 0 || results.courses.length > 0,
        [results]
    );

    useEffect(() => {
        if (query.trim().length < 2) {
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
    }, [query]);

    return (
        <div className="relative hidden md:block w-[360px]">
            <Input
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                    window.setTimeout(() => setOpen(false), 150);
                }}
                placeholder="Search leads, students, phone, courses"
                className="h-9"
            />

            {open && query.trim().length >= 2 ? (
                <div className="absolute z-50 mt-2 w-full rounded-md border bg-background shadow-md p-2">
                    {loading ? <p className="px-2 py-3 text-xs text-muted-foreground">Searching...</p> : null}

                    {!loading && !hasAnyResult ? (
                        <p className="px-2 py-3 text-xs text-muted-foreground">No results found.</p>
                    ) : null}

                    {!loading && results.leads.length > 0 ? (
                        <div className="mb-2">
                            <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase">Leads</p>
                            {results.leads.map((lead) => (
                                <Link
                                    key={`lead-${lead.id}`}
                                    href={`/leads?query=${encodeURIComponent(lead.phone || lead.name)}`}
                                    className="block rounded px-2 py-1.5 text-sm hover:bg-muted"
                                >
                                    <p className="font-medium">{lead.name}</p>
                                    <p className="text-xs text-muted-foreground">{lead.phone} • {lead.status}</p>
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {!loading && results.students.length > 0 ? (
                        <div className="mb-2">
                            <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase">Students</p>
                            {results.students.map((student) => (
                                <Link
                                    key={`student-${student.id}`}
                                    href={`/students?query=${encodeURIComponent(student.phone || student.name)}`}
                                    className="block rounded px-2 py-1.5 text-sm hover:bg-muted"
                                >
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">{student.phone}</p>
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {!loading && results.courses.length > 0 ? (
                        <div>
                            <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase">Courses</p>
                            {results.courses.map((course) => (
                                <Link
                                    key={`course-${course.id}`}
                                    href={`/courses?query=${encodeURIComponent(course.name)}`}
                                    className="block rounded px-2 py-1.5 text-sm hover:bg-muted"
                                >
                                    <p className="font-medium">{course.name}</p>
                                    <p className="text-xs text-muted-foreground">{course.duration || "Duration not set"}</p>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
