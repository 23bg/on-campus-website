"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2, CreditCard } from "lucide-react";

type BillingSummary = {
    planAmount: number;
    currency: string;
    status: string;
    nextBillingDate?: string | null;
    razorpaySubId?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
    TRIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    INACTIVE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function BillingPage() {
    const [summary, setSummary] = useState<BillingSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const loadSummary = async () => {
        try {
            const response = await api.get(API.INTERNAL.BILLING.ROOT);
            setSummary(response.data?.data ?? null);
        } catch {
            toast.error("Failed to load billing info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSummary(); }, []);

    const createSubscription = async () => {
        setCreating(true);
        try {
            await api.post(API.INTERNAL.BILLING.ROOT, { action: "create-subscription" });
            toast.success("Subscription initiated");
            await loadSummary();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Network error");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <main className="p-6 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </main>
        );
    }

    return (
        <main className="p-6 max-w-2xl">
            <h1 className="font-heading text-2xl font-semibold">Billing</h1>
            <p className="mt-1 text-muted-foreground">Manage your subscription and billing.</p>

            <Card className="mt-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Subscription Plan
                            </CardTitle>
                            <CardDescription className="mt-1">OnCampus Pro — ₹{summary?.planAmount ?? 999}/month</CardDescription>
                        </div>
                        <Badge variant="secondary" className={STATUS_COLORS[summary?.status ?? "TRIAL"] ?? ""}>
                            {summary?.status ?? "TRIAL"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">{summary?.status ?? "TRIAL"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next billing date</span>
                        <span className="font-medium">
                            {summary?.nextBillingDate ? new Date(summary.nextBillingDate).toLocaleDateString() : "Not set"}
                        </span>
                    </div>
                    {summary?.razorpaySubId ? (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Razorpay ID</span>
                            <span className="font-mono text-xs">{summary.razorpaySubId}</span>
                        </div>
                    ) : null}

                    {!summary?.razorpaySubId ? (
                        <Button onClick={createSubscription} disabled={creating} className="w-full mt-2">
                            {creating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Subscribe Now"}
                        </Button>
                    ) : null}
                </CardContent>
            </Card>
        </main>
    );
}
