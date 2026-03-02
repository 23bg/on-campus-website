"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2, IndianRupee, AlertTriangle, GraduationCap, UserPlus, Users } from "lucide-react";
import { TablePaginationControls } from "@/components/ui/table-pagination-controls";

type Metrics = {
    leadsThisMonth: number;
    admissionsThisMonth: number;
    totalStudents: number;
    conversionPercentage: number;
    totalFeesCollectedThisMonth: number;
    totalOutstandingFees: number;
    todayOverview?: {
        newLeads: number;
        feesCollected: number;
        feesDueToday: number;
        newStudents: number;
    };
    recentLeads?: Array<{
        id: string;
        name: string;
        phone: string;
        status: string;
        createdAt: string;
    }>;
    recentPayments?: Array<{
        id: string;
        amount: number;
        method?: string | null;
        paidOn: string;
        student: {
            name: string;
            phone: string;
        };
    }>;
    followUpOverview?: {
        todayCount: number;
        overdueCount: number;
        todaysFollowUps: Array<{
            id: string;
            name: string;
            phone: string;
            followUpAt?: string | null;
            status: string;
        }>;
        overdueFollowUps: Array<{
            id: string;
            name: string;
            phone: string;
            followUpAt?: string | null;
            status: string;
        }>;
    };
};

type Defaulter = {
    studentId: string;
    studentName: string;
    phone: string;
    courseName: string;
    totalFees: number;
    totalPaid: number;
    pending: number;
    dueDate?: string | null;
};

const PAGE_SIZE = 5;

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
    const [loading, setLoading] = useState(true);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementBody, setAnnouncementBody] = useState("");
    const [postingAnnouncement, setPostingAnnouncement] = useState(false);
    const [todayFollowUpsPage, setTodayFollowUpsPage] = useState(1);
    const [overdueFollowUpsPage, setOverdueFollowUpsPage] = useState(1);
    const [recentLeadsPage, setRecentLeadsPage] = useState(1);
    const [recentPaymentsPage, setRecentPaymentsPage] = useState(1);
    const [defaultersPage, setDefaultersPage] = useState(1);

    useEffect(() => {
        const load = async () => {
            try {
                const [metricsRes, defaultersRes] = await Promise.all([
                    api.get(API.INTERNAL.DASHBOARD.METRICS),
                    api.get(API.INTERNAL.DASHBOARD.DEFAULTERS),
                ]);
                setMetrics(metricsRes.data?.data ?? null);
                setDefaulters(defaultersRes.data?.data ?? []);
            } catch {
                // silently fail — show zeros
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatCurrency = (v: number) => `₹${v.toLocaleString("en-IN")}`;

    useEffect(() => {
        setTodayFollowUpsPage(1);
        setOverdueFollowUpsPage(1);
        setRecentLeadsPage(1);
        setRecentPaymentsPage(1);
        setDefaultersPage(1);
    }, [metrics, defaulters.length]);

    const todayFollowUps = metrics?.followUpOverview?.todaysFollowUps ?? [];
    const overdueFollowUps = metrics?.followUpOverview?.overdueFollowUps ?? [];
    const recentLeads = metrics?.recentLeads ?? [];
    const recentPayments = metrics?.recentPayments ?? [];

    const paginatedTodayFollowUps = todayFollowUps.slice((todayFollowUpsPage - 1) * PAGE_SIZE, todayFollowUpsPage * PAGE_SIZE);
    const paginatedOverdueFollowUps = overdueFollowUps.slice((overdueFollowUpsPage - 1) * PAGE_SIZE, overdueFollowUpsPage * PAGE_SIZE);
    const paginatedRecentLeads = recentLeads.slice((recentLeadsPage - 1) * PAGE_SIZE, recentLeadsPage * PAGE_SIZE);
    const paginatedRecentPayments = recentPayments.slice((recentPaymentsPage - 1) * PAGE_SIZE, recentPaymentsPage * PAGE_SIZE);
    const paginatedDefaulters = defaulters.slice((defaultersPage - 1) * PAGE_SIZE, defaultersPage * PAGE_SIZE);

    const postAnnouncement = async () => {
        if (!announcementTitle.trim() || !announcementBody.trim()) {
            toast.error("Title and message are required");
            return;
        }

        setPostingAnnouncement(true);
        try {
            await api.post("/announcements", {
                title: announcementTitle,
                body: announcementBody,
            });
            setAnnouncementTitle("");
            setAnnouncementBody("");
            toast.success("Announcement posted");
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Failed to post announcement");
        } finally {
            setPostingAnnouncement(false);
        }
    };

    // Reordered: Fees first (money), then admissions, leads, students
    const cards = [
        { label: "Fees Collected", value: formatCurrency(metrics?.totalFeesCollectedThisMonth ?? 0), icon: IndianRupee, color: "text-emerald-600" },
        { label: "Outstanding Fees", value: formatCurrency(metrics?.totalOutstandingFees ?? 0), icon: AlertTriangle, color: "text-red-600" },
        { label: "Admissions This Month", value: metrics?.admissionsThisMonth ?? 0, icon: GraduationCap, color: "text-green-600" },
        { label: "Leads This Month", value: metrics?.leadsThisMonth ?? 0, icon: UserPlus, color: "text-blue-600" },
        { label: "Total Students", value: metrics?.totalStudents ?? 0, icon: Users, color: "text-violet-600" },
    ];

    return (
        <main className="p-6">
            <h1 className=" text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Monthly performance snapshot.</p>

            {loading ? (
                <div className="mt-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {cards.map((card) => (
                            <Card key={card.label}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">Today Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">New Leads</p>
                                    <p className="text-xl font-semibold">{metrics?.todayOverview?.newLeads ?? 0}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Fees Collected</p>
                                    <p className="text-xl font-semibold">{formatCurrency(metrics?.todayOverview?.feesCollected ?? 0)}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Fees Due Today</p>
                                    <p className="text-xl font-semibold">{metrics?.todayOverview?.feesDueToday ?? 0}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">New Students</p>
                                    <p className="text-xl font-semibold">{metrics?.todayOverview?.newStudents ?? 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">Post Announcement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input
                                placeholder="Announcement title"
                                value={announcementTitle}
                                onChange={(event) => setAnnouncementTitle(event.target.value)}
                                maxLength={120}
                            />
                            <Textarea
                                placeholder="Holiday notice, exam schedule, batch update..."
                                value={announcementBody}
                                onChange={(event) => setAnnouncementBody(event.target.value)}
                                rows={3}
                                maxLength={1000}
                            />
                            <div className="flex justify-end">
                                <Button onClick={postAnnouncement} disabled={postingAnnouncement}>
                                    {postingAnnouncement ? "Posting..." : "Post Announcement"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Today&apos;s Follow-ups</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!todayFollowUps.length ? (
                                    <p className="text-sm text-muted-foreground">No follow-ups scheduled for today.</p>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginatedTodayFollowUps.map((lead) => (
                                                    <TableRow key={lead.id}>
                                                        <TableCell className="font-medium max-w-[180px] truncate" title={lead.name}>{lead.name}</TableCell>
                                                        <TableCell>{lead.phone}</TableCell>
                                                        <TableCell>{lead.followUpAt ? new Date(lead.followUpAt).toLocaleDateString() : "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePaginationControls
                                            className="mt-3"
                                            page={todayFollowUpsPage}
                                            pageSize={PAGE_SIZE}
                                            totalItems={todayFollowUps.length}
                                            onPageChange={setTodayFollowUpsPage}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-red-600">Overdue Follow-ups</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!overdueFollowUps.length ? (
                                    <p className="text-sm text-muted-foreground">No overdue follow-ups.</p>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>Due</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginatedOverdueFollowUps.map((lead) => (
                                                    <TableRow key={lead.id}>
                                                        <TableCell className="font-medium max-w-[180px] truncate" title={lead.name}>{lead.name}</TableCell>
                                                        <TableCell>{lead.phone}</TableCell>
                                                        <TableCell className="text-red-600">{lead.followUpAt ? new Date(lead.followUpAt).toLocaleDateString() : "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePaginationControls
                                            className="mt-3"
                                            page={overdueFollowUpsPage}
                                            pageSize={PAGE_SIZE}
                                            totalItems={overdueFollowUps.length}
                                            onPageChange={setOverdueFollowUpsPage}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Leads</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!recentLeads.length ? (
                                    <p className="text-sm text-muted-foreground">No recent leads yet. Share your institute link to start receiving enquiries.</p>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginatedRecentLeads.map((lead) => (
                                                    <TableRow key={lead.id}>
                                                        <TableCell className="font-medium max-w-[180px] truncate" title={lead.name}>{lead.name}</TableCell>
                                                        <TableCell>{lead.phone}</TableCell>
                                                        <TableCell>{lead.status}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePaginationControls
                                            className="mt-3"
                                            page={recentLeadsPage}
                                            pageSize={PAGE_SIZE}
                                            totalItems={recentLeads.length}
                                            onPageChange={setRecentLeadsPage}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!recentPayments.length ? (
                                    <p className="text-sm text-muted-foreground">No recent payments found.</p>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead>Method</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginatedRecentPayments.map((payment) => (
                                                    <TableRow key={payment.id}>
                                                        <TableCell className="font-medium max-w-[180px] truncate" title={payment.student.name}>{payment.student.name}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                                                        <TableCell className="max-w-[140px] truncate" title={payment.method || "-"}>{payment.method || "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePaginationControls
                                            className="mt-3"
                                            page={recentPaymentsPage}
                                            pageSize={PAGE_SIZE}
                                            totalItems={recentPayments.length}
                                            onPageChange={setRecentPaymentsPage}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Defaulters List */}
                    {defaulters.length > 0 ? (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    Fee Defaulters ({defaulters.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sr. No.</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead className="text-right">Total Fees</TableHead>
                                            <TableHead className="text-right">Paid</TableHead>
                                            <TableHead className="text-right">Pending</TableHead>
                                            <TableHead>Due Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedDefaulters.map((d, index) => (
                                            <TableRow key={d.studentId}>
                                                <TableCell>{(defaultersPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                                                <TableCell className="font-medium max-w-[180px] truncate" title={d.studentName}>{d.studentName}</TableCell>
                                                <TableCell>{d.phone}</TableCell>
                                                <TableCell className="max-w-[180px] truncate" title={d.courseName}>{d.courseName}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(d.totalFees)}</TableCell>
                                                <TableCell className="text-right text-green-600">{formatCurrency(d.totalPaid)}</TableCell>
                                                <TableCell className="text-right font-medium text-red-600">{formatCurrency(d.pending)}</TableCell>
                                                <TableCell>{d.dueDate ? new Date(d.dueDate).toLocaleDateString() : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePaginationControls
                                    className="mt-3"
                                    page={defaultersPage}
                                    pageSize={PAGE_SIZE}
                                    totalItems={defaulters.length}
                                    onPageChange={setDefaultersPage}
                                />
                            </CardContent>
                        </Card>
                    ) : null}
                </>
            )}
        </main>
    );
}
