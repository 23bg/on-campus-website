"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, IndianRupee, AlertTriangle, GraduationCap, UserPlus, Users } from "lucide-react";

type Metrics = {
    leadsThisMonth: number;
    admissionsThisMonth: number;
    totalStudents: number;
    conversionPercentage: number;
    totalFeesCollectedThisMonth: number;
    totalOutstandingFees: number;
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
                    fetch("/api/dashboard/metrics", { cache: "no-store" }),
                    fetch("/api/dashboard/defaulters", { cache: "no-store" }),
                ]);
                const [metricsJson, defaultersJson] = await Promise.all([
                    metricsRes.json(),
                    defaultersRes.json(),
                ]);
                setMetrics(metricsJson.data ?? null);
                setDefaulters(defaultersJson.data ?? []);
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
            <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
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
                                        {defaulters.map((d) => (
                                            <TableRow key={d.studentId}>
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
