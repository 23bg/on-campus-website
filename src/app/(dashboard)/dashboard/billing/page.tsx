"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Loader2, CreditCard } from "lucide-react";
import { PLAN_CONFIG, PlanType } from "@/config/plans";
import type { BillingInterval } from "@/features/subscription/services/subscription.service";
import Script from "next/script";

type RazorpayCheckoutResponse = {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
    key: string;
    subscription_id: string;
    name: string;
    description: string;
    handler: (response: RazorpayCheckoutResponse) => void | Promise<void>;
    modal?: {
        ondismiss?: () => void;
    };
};

type RazorpayInstance = {
    open: () => void;
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => RazorpayInstance;

type BillingSummary = {
    planType: PlanType;
    planName?: string;
    planAmount: number;
    planAmountYearly?: number;
    currency: string;
    userLimit: number | null;
    usersUsed: number;
    status: string;
    billingInterval?: BillingInterval;
    autopayEnabled?: boolean;
    paymentMethodAddedAt?: string | null;
    trialDaysRemaining?: number | null;
    trialPaymentReminder?: boolean;
    nextBillingDate?: string | null;
    razorpaySubId?: string | null;
    lastPaymentAmount?: number | null;
    lastPaymentDate?: string | null;
};

type UsageSummary = {
    planType: PlanType;
    alertsUsed: number;
    alertsIncluded: number;
    extraAlerts: number;
    extraAlertRate: number;
    estimatedUsageCost: number;
};

type InvoiceHistoryItem = {
    id: string;
    month: number;
    year: number;
    periodStart: string;
    periodEnd: string;
    planCharge: number;
    usageCharge: number;
    totalAmount: number;
    status: "PENDING" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";
    dueDate?: string | null;
    issuedAt?: string | null;
    paidAt?: string | null;
    paymentLinkUrl?: string | null;
    downloadUrl?: string | null;
};

type BillingDashboardPayload = {
    summary: BillingSummary;
    usage: UsageSummary;
    policy: {
        hasOverdue: boolean;
        alertsEnabled: boolean;
        accessRestricted: boolean;
        hasExhaustedPendingInvoice?: boolean;
        notifyPaymentMethodUpdate?: boolean;
    };
    sender?: {
        mode: "ONCAMPUS_SHARED" | "INSTITUTE_CUSTOM";
        connectedNumber?: string | null;
        status?: string;
    };
    invoices: InvoiceHistoryItem[];
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
    const [generatingInvoice, setGeneratingInvoice] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>("STARTER");
    const [selectedInterval, setSelectedInterval] = useState<BillingInterval>("MONTHLY");
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [invoices, setInvoices] = useState<InvoiceHistoryItem[]>([]);
    const [policy, setPolicy] = useState<BillingDashboardPayload["policy"] | null>(null);
    const [sender, setSender] = useState<BillingDashboardPayload["sender"] | null>(null);
    const [retryingInvoiceId, setRetryingInvoiceId] = useState<string | null>(null);

    const usageWarningThreshold = usage ? Math.floor(usage.alertsIncluded * 0.8) : null;
    const isUsageWarning = usage && usage.alertsIncluded > 0 && usage.alertsUsed >= (usageWarningThreshold ?? 0);

    const loadSummary = async () => {
        try {
            const response = await api.get<{ success: boolean; data: BillingDashboardPayload }>(API.INTERNAL.BILLING.ROOT);
            const payload = response.data?.data;
            if (!payload) return;

            setSummary(payload.summary);
            setUsage(payload.usage);
            setInvoices(payload.invoices ?? []);
            setPolicy(payload.policy);
            setSender(payload.sender ?? null);

            if (payload.summary?.planType) {
                setSelectedPlan(payload.summary.planType);
            }
            if (payload.summary?.billingInterval) {
                setSelectedInterval(payload.summary.billingInterval);
            }
        } catch {
            toast.error("Failed to load billing info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSummary(); }, []);

    const createSubscription = async (planType: PlanType) => {
        setCreating(true);
        try {
            const response = await api.post(API.INTERNAL.BILLING.ROOT, {
                action: "create-subscription",
                planType,
                interval: selectedInterval,
            });

            const payload = response.data?.data as {
                subscriptionId?: string;
                key?: string;
            };

            if (!payload?.subscriptionId || !payload?.key) {
                throw new Error("Missing checkout payload");
            }

            const RazorpayCtor = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
            if (!RazorpayCtor) {
                throw new Error("Razorpay SDK not loaded");
            }

            const rzp = new RazorpayCtor({
                key: payload.key,
                subscription_id: payload.subscriptionId,
                name: "OnCampus",
                description: "Admission and Student Management Platform Subscription",
                handler: async (checkoutResponse) => {
                    await api.post(API.INTERNAL.BILLING.CONFIRM, checkoutResponse);
                    toast.success(`${planType} plan activated`);
                    await loadSummary();
                },
                modal: {
                    ondismiss: () => {
                        toast.message("Checkout closed. Complete payment setup to activate trial.");
                    },
                },
            });

            rzp.open();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Network error");
        } finally {
            setCreating(false);
        }
    };

    const generateInvoice = async () => {
        setGeneratingInvoice(true);
        try {
            await api.post(API.INTERNAL.BILLING.ROOT, {
                action: "generate-invoice",
            });
            toast.success("Invoice generated for last closed month");
            await loadSummary();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Unable to generate invoice");
        } finally {
            setGeneratingInvoice(false);
        }
    };

    const retryInvoice = async (invoiceId: string) => {
        setRetryingInvoiceId(invoiceId);
        try {
            await api.post(API.INTERNAL.BILLING.ROOT, {
                action: "retry-invoice",
                invoiceId,
            });
            toast.success("Invoice retry scheduled");
            await loadSummary();
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message ?? "Unable to retry invoice");
        } finally {
            setRetryingInvoiceId(null);
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
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
            />
            <h1 className=" text-2xl font-semibold">Billing</h1>
            <p className="mt-1 text-muted-foreground">Manage your subscription and billing.</p>

            {summary?.status === "INACTIVE" ? (
                <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                    Trial has expired. Choose a plan below to continue full access.
                </div>
            ) : null}

            {policy && !policy.alertsEnabled ? (
                <div className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    WhatsApp alerts are currently disabled due to overdue invoice payment.
                </div>
            ) : null}

            {summary?.trialPaymentReminder ? (
                <div className="mt-4 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                    Trial ends in {summary.trialDaysRemaining ?? 0} day(s). Add payment method now to keep account active on expiry.
                </div>
            ) : null}

            {policy?.notifyPaymentMethodUpdate ? (
                <div className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    Automatic payment retries have failed. Update payment method and retry invoice payment.
                </div>
            ) : null}

            <Card className="mt-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Subscription Plan
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {summary?.planName ?? "Starter System"} — ₹{summary?.planAmount ?? PLAN_CONFIG.STARTER.priceMonthly}/month
                                {summary?.planAmountYearly ? ` · ₹${summary.planAmountYearly}/year` : ""}
                            </CardDescription>
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
                        <span className="text-muted-foreground">Billing cycle</span>
                        <span className="font-medium">{summary?.billingInterval ?? "MONTHLY"} (1st - last day)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Autopay status</span>
                        <span className="font-medium">{summary?.autopayEnabled ? "Enabled" : "Not configured"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Users</span>
                        <span className="font-medium">{summary?.usersUsed ?? 0}/{summary?.userLimit ?? 1}</span>
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

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last payment</span>
                        <span className="font-medium">
                            {summary?.lastPaymentDate && summary?.lastPaymentAmount
                                ? `${new Date(summary.lastPaymentDate).toLocaleDateString()} • ₹${summary.lastPaymentAmount}`
                                : "No payment history yet"}
                        </span>
                    </div>

                    <div className="grid gap-2 pt-2 sm:grid-cols-3">
                        <Button
                            variant={selectedInterval === "MONTHLY" ? "default" : "outline"}
                            disabled={creating}
                            onClick={() => setSelectedInterval("MONTHLY")}
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={selectedInterval === "YEARLY" ? "default" : "outline"}
                            disabled={creating}
                            onClick={() => setSelectedInterval("YEARLY")}
                        >
                            Yearly (10-month price)
                        </Button>
                        <Button variant="outline" disabled={generatingInvoice} onClick={() => void generateInvoice()}>
                            {generatingInvoice ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Last Invoice"}
                        </Button>
                    </div>

                    <div className="grid gap-2 pt-2 sm:grid-cols-3">
                        <Button
                            variant={selectedPlan === "STARTER" ? "default" : "outline"}
                            disabled={creating}
                            onClick={() => {
                                setSelectedPlan("STARTER");
                                void createSubscription("STARTER");
                            }}
                        >
                            {creating && selectedPlan === "STARTER" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Choose Starter (₹${PLAN_CONFIG.STARTER.priceMonthly})`}
                        </Button>
                        <Button
                            variant={selectedPlan === "GROWTH" ? "default" : "outline"}
                            disabled={creating}
                            onClick={() => {
                                setSelectedPlan("GROWTH");
                                void createSubscription("GROWTH");
                            }}
                        >
                            {creating && selectedPlan === "GROWTH" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Upgrade Growth (₹${PLAN_CONFIG.GROWTH.priceMonthly})`}
                        </Button>
                        <Button
                            variant={selectedPlan === "SCALE" ? "default" : "outline"}
                            disabled={creating}
                            onClick={() => {
                                setSelectedPlan("SCALE");
                                void createSubscription("SCALE");
                            }}
                        >
                            {creating && selectedPlan === "SCALE" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Upgrade Scale (₹${PLAN_CONFIG.SCALE.priceMonthly})`}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Usage Summary</CardTitle>
                    <CardDescription>Current month WhatsApp alerts usage and estimated overage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {isUsageWarning ? (
                        <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                            Usage warning: {usage?.alertsUsed ?? 0} of {usage?.alertsIncluded ?? 0} alerts used (80% threshold: {usageWarningThreshold ?? 0}).
                        </div>
                    ) : null}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Alerts used</span>
                        <span className="font-medium">{usage?.alertsUsed ?? 0} / {usage?.alertsIncluded ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Sender mode</span>
                        <span className="font-medium">
                            {sender?.mode === "INSTITUTE_CUSTOM"
                                ? `Institute WhatsApp Number${sender?.connectedNumber ? ` (${sender.connectedNumber})` : ""}`
                                : "OnCampus Shared Number"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Extra alerts</span>
                        <span className="font-medium">{usage?.extraAlerts ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Extra alert rate</span>
                        <span className="font-medium">₹{usage?.extraAlertRate?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated usage cost</span>
                        <span className="font-semibold">₹{usage?.estimatedUsageCost?.toFixed(2) ?? "0.00"}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>One monthly invoice including plan and usage charges.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {invoices.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No invoices generated yet.</p>
                    ) : (
                        invoices.map((invoice) => (
                            <div key={invoice.id} className="rounded border p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium">
                                        {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
                                    </p>
                                    <Badge variant={invoice.status === "PAID" ? "default" : invoice.status === "OVERDUE" ? "destructive" : "secondary"}>
                                        {invoice.status}
                                    </Badge>
                                </div>
                                <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
                                    <p>Plan: ₹{invoice.planCharge.toFixed(2)}</p>
                                    <p>Usage: ₹{invoice.usageCharge.toFixed(2)}</p>
                                    <p className="font-semibold text-foreground">Total: ₹{invoice.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                    {invoice.paymentLinkUrl ? (
                                        <Button asChild variant="outline" size="sm">
                                            <a href={invoice.paymentLinkUrl} target="_blank" rel="noreferrer">Pay Invoice</a>
                                        </Button>
                                    ) : null}
                                    {invoice.status !== "PAID" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={retryingInvoiceId === invoice.id}
                                            onClick={() => void retryInvoice(invoice.id)}
                                        >
                                            {retryingInvoiceId === invoice.id ? "Retrying..." : "Retry Payment"}
                                        </Button>
                                    ) : null}
                                    {invoice.downloadUrl ? (
                                        <Button asChild variant="outline" size="sm">
                                            <a href={invoice.downloadUrl} target="_blank" rel="noreferrer">Download Invoice</a>
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
