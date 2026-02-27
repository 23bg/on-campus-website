"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

type Lead = {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    course?: string | null;
    source?: string | null;
    status: string;
    createdAt: string;
};

const STATUS_OPTIONS = ["NEW", "CONTACTED", "ADMITTED", "DROPPED"] as const;
const STATUS_COLORS: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    CONTACTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ADMITTED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    DROPPED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [status, setStatus] = useState("all");
    const [query, setQuery] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(true);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (status && status !== "all") params.set("status", status);
        if (query) params.set("query", query);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        return params.toString();
    }, [status, query, from, to]);

    const loadLeads = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`${API.INTERNAL.LEADS.ROOT}${queryString ? `?${queryString}` : ""}`);
            setLeads(response.data?.data ?? []);
        } catch {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        loadLeads();
    }, [loadLeads]);

    const updateStatus = async (leadId: string, nextStatus: string) => {
        try {
            await api.patch(API.INTERNAL.LEADS.BY_ID(leadId), { status: nextStatus });
            toast.success(`Lead marked as ${nextStatus}`);
            await loadLeads();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Network error");
        }
    };

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold">Leads</h1>
                    <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads</p>
                </div>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-5">
                        <Input placeholder="Search name or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                        <Button onClick={loadLeads} variant="outline">Refresh</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sr. No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : leads.map((lead, index) => (
                            <TableRow key={lead.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>{lead.phone}</TableCell>
                                <TableCell>{lead.email || "-"}</TableCell>
                                <TableCell>{lead.course || "-"}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={STATUS_COLORS[lead.status] ?? ""}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                                        <SelectTrigger className="h-8 w-[130px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
