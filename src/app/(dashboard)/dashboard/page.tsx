"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2, IndianRupee, AlertTriangle, GraduationCap, UserPlus, Users } from "lucide-react";

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

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
    const [loading, setLoading] = useState(true);

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

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Leads</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!metrics?.recentLeads?.length ? (
                                    <p className="text-sm text-muted-foreground">No recent leads yet. Share your institute link to start receiving enquiries.</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {metrics.recentLeads.map((lead) => (
                                                <TableRow key={lead.id}>
                                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                                    <TableCell>{lead.phone}</TableCell>
                                                    <TableCell>{lead.status}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!metrics?.recentPayments?.length ? (
                                    <p className="text-sm text-muted-foreground">No recent payments found.</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {metrics.recentPayments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="font-medium">{payment.student.name}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                                                    <TableCell>{payment.method || "-"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
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
                                        {defaulters.map((d, index) => (
                                            <TableRow key={d.studentId}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{d.studentName}</TableCell>
                                                <TableCell>{d.phone}</TableCell>
                                                <TableCell>{d.courseName}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(d.totalFees)}</TableCell>
                                                <TableCell className="text-right text-green-600">{formatCurrency(d.totalPaid)}</TableCell>
                                                <TableCell className="text-right font-medium text-red-600">{formatCurrency(d.pending)}</TableCell>
                                                <TableCell>{d.dueDate ? new Date(d.dueDate).toLocaleDateString() : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : null}
                </>
            )}
        </main>
    );
}
