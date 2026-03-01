"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2, PhoneCall } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Lead = {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    course?: string | null;
    source?: string | null;
    status: string;
    message?: string | null;
    followUpAt?: string | null;
    createdAt: string;
};

type LeadActivity = {
    activityType: string;
    title: string;
    description?: string;
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
    const searchParams = useSearchParams();
    const isMobile = useIsMobile();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [status, setStatus] = useState("all");
    const [query, setQuery] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [notes, setNotes] = useState("");
    const [followUpAt, setFollowUpAt] = useState("");
    const [savingDetails, setSavingDetails] = useState(false);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [timeline, setTimeline] = useState<LeadActivity[]>([]);

    useEffect(() => {
        const q = searchParams.get("query") ?? "";
        if (q && !query) {
            setQuery(q);
        }
    }, [searchParams, query]);

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

    const openDetails = (lead: Lead) => {
        setEditingLead(lead);
        setNotes(lead.message ?? "");
        setFollowUpAt(lead.followUpAt ? lead.followUpAt.slice(0, 10) : "");
        setTimelineLoading(true);
        api
            .get(API.INTERNAL.LEADS.TIMELINE(lead.id))
            .then((response) => {
                setTimeline(response.data?.data ?? []);
            })
            .catch(() => {
                setTimeline([]);
            })
            .finally(() => {
                setTimelineLoading(false);
            });
    };

    const saveDetails = async () => {
        if (!editingLead) return;

        setSavingDetails(true);
        try {
            await api.patch(API.INTERNAL.LEADS.BY_ID(editingLead.id), {
                message: notes || null,
                followUpAt: followUpAt || null,
            });
            toast.success("Lead details updated");
            setEditingLead(null);
            await loadLeads();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Network error");
        } finally {
            setSavingDetails(false);
        }
    };

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className=" text-2xl font-semibold">Leads</h1>
                    <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads</p>
                </div>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-5">
                        <Input placeholder="Search name or phone" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={120} />
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

            {isMobile ? (
                <div className="mt-4 space-y-3">
                    {loading ? (
                        <div className="rounded border py-8">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="rounded border py-8 text-center text-sm text-muted-foreground">
                            No leads yet. Share your institute page to start collecting enquiries.
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <Card key={lead.id}>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-semibold text-sm">{lead.name}</p>
                                            <p className="text-xs text-muted-foreground">{lead.phone}</p>
                                        </div>
                                        <Badge variant="secondary" className={STATUS_COLORS[lead.status] ?? ""}>
                                            {lead.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <p className="text-muted-foreground">Course</p>
                                        <p>{lead.course || "-"}</p>
                                        <p className="text-muted-foreground">Follow-up</p>
                                        <p>{lead.followUpAt ? new Date(lead.followUpAt).toLocaleDateString() : "-"}</p>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">{lead.message || "No notes added."}</p>

                                    <div className="space-y-2">
                                        <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openDetails(lead)}>Details</Button>
                                            <Button asChild size="sm">
                                                <a href={`tel:${lead.phone}`}>
                                                    <PhoneCall className="h-4 w-4 mr-1" />
                                                    Call
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <div className="mt-4 rounded border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sr. No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Follow-up</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8">
                                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                        No leads yet. Share your institute page to start collecting enquiries.
                                    </TableCell>
                                </TableRow>
                            ) : leads.map((lead, index) => (
                                <TableRow key={lead.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium max-w-[180px] truncate" title={lead.name}>{lead.name}</TableCell>
                                    <TableCell>{lead.phone}</TableCell>
                                    <TableCell className="max-w-[220px] truncate" title={lead.email || "-"}>{lead.email || "-"}</TableCell>
                                    <TableCell className="max-w-[180px] truncate" title={lead.course || "-"}>{lead.course || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={STATUS_COLORS[lead.status] ?? ""}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {lead.followUpAt ? new Date(lead.followUpAt).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground" title={lead.message || "-"}>{lead.message || "-"}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                                                <SelectTrigger className="h-8 w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <Button variant="outline" size="sm" onClick={() => openDetails(lead)}>Notes</Button>
                                            <Button asChild size="icon" variant="outline" className="h-8 w-8">
                                                <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name}`}>
                                                    <PhoneCall className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={Boolean(editingLead)} onOpenChange={(open) => !open && setEditingLead(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Lead Notes & Follow-up</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-1">
                        <div className="space-y-2">
                            <Label>Follow-up Date</Label>
                            <Input type="date" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Called parent, interested in NEET, follow-up on Sunday..." maxLength={1024} />
                        </div>

                        <div className="space-y-2">
                            <Label>Activity Timeline</Label>
                            <div className="rounded border p-3 max-h-48 overflow-auto space-y-2">
                                {timelineLoading ? (
                                    <p className="text-xs text-muted-foreground">Loading timeline...</p>
                                ) : timeline.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No activity history available.</p>
                                ) : (
                                    timeline.map((item, index) => (
                                        <div key={`${item.activityType}-${item.createdAt}-${index}`} className="text-xs border-b last:border-0 pb-2 last:pb-0">
                                            <p className="font-medium">{item.title}</p>
                                            {item.description ? <p className="text-muted-foreground">{item.description}</p> : null}
                                            <p className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingLead(null)}>Cancel</Button>
                        <Button onClick={saveDetails} disabled={savingDetails}>{savingDetails ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
