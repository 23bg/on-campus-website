"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { API } from "@/constants/api";

type DashboardSettings = {
    compactTables: boolean;
    autoRefreshDashboard: boolean;
    showAmountsInLakh: boolean;
};

type NotificationSettings = {
    desktopAlerts: boolean;
    paymentReminders: boolean;
    leadActivityAlerts: boolean;
};

type AppSettings = {
    dashboard: DashboardSettings;
    notifications: NotificationSettings;
};

type DomainStatus = "PENDING" | "VERIFIED" | "ACTIVE" | "FAILED";

type DomainSettings = {
    slug: string;
    customDomain: string;
    domainVerified: boolean;
    domainStatus: DomainStatus;
    defaultDomain: string;
    dnsInstruction: {
        type: string;
        name: string;
        target: string;
    };
};

const SETTINGS_STORAGE_KEY = "oncampus:settings";

const defaultSettings: AppSettings = {
    dashboard: {
        compactTables: false,
        autoRefreshDashboard: true,
        showAmountsInLakh: false,
    },
    notifications: {
        desktopAlerts: true,
        paymentReminders: true,
        leadActivityAlerts: true,
    },
};

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [dataCounts, setDataCounts] = useState({ students: 0, leads: 0, courses: 0, payments: 0 });
    const [exporting, setExporting] = useState(false);
    const [domainSettings, setDomainSettings] = useState<DomainSettings | null>(null);
    const [domainInput, setDomainInput] = useState("");
    const [domainSaving, setDomainSaving] = useState(false);
    const [domainVerifying, setDomainVerifying] = useState(false);
    const [domainActivating, setDomainActivating] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as AppSettings;
            setSettings({
                dashboard: { ...defaultSettings.dashboard, ...parsed.dashboard },
                notifications: { ...defaultSettings.notifications, ...parsed.notifications },
            });
        } catch {
            setSettings(defaultSettings);
        }

        const loadCounts = async () => {
            try {
                const [studentsRes, leadsRes, coursesRes, paymentsRes] = await Promise.all([
                    api.get(API.INTERNAL.STUDENTS.ROOT),
                    api.get(API.INTERNAL.LEADS.ROOT),
                    api.get(API.INTERNAL.COURSES.ROOT),
                    api.get(API.INTERNAL.PAYMENTS.ROOT),
                ]);

                setDataCounts({
                    students: (studentsRes.data?.data ?? []).length,
                    leads: (leadsRes.data?.data ?? []).length,
                    courses: (coursesRes.data?.data ?? []).length,
                    payments: (paymentsRes.data?.data ?? []).length,
                });
            } catch {
                // Keep defaults silently
            }
        };

        const loadDomainSettings = async () => {
            try {
                const response = await api.get<{ success: boolean; data: DomainSettings }>(API.INTERNAL.INSTITUTE.DOMAIN);
                setDomainSettings(response.data.data);
                setDomainInput(response.data.data.customDomain ?? "");
            } catch {
                // Keep domain section available for manual input
            }
        };

        loadCounts();
        loadDomainSettings();
    }, []);

    const getStatusVariant = (status: DomainStatus): "default" | "secondary" | "destructive" => {
        if (status === "ACTIVE") return "default";
        if (status === "FAILED") return "destructive";
        return "secondary";
    };

    const saveDomain = async () => {
        if (!domainInput.trim()) {
            toast.error("Please enter a custom domain");
            return;
        }

        setDomainSaving(true);
        try {
            const response = await api.put<{ success: boolean; data: DomainSettings }>(API.INTERNAL.INSTITUTE.DOMAIN, {
                customDomain: domainInput,
                surface: "portal",
            });
            setDomainSettings(response.data.data);
            setDomainInput(response.data.data.customDomain ?? "");
            toast.success("Domain saved. Add DNS record and verify.");
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            toast.error(message ?? "Unable to save custom domain");
        } finally {
            setDomainSaving(false);
        }
    };

    const verifyDomain = async () => {
        setDomainVerifying(true);
        try {
            const response = await api.post<{
                success: boolean;
                data: { verified: boolean; host: string; nextStep: string };
            }>(API.INTERNAL.INSTITUTE.DOMAIN, {
                action: "verify",
                customDomain: domainInput,
            });

            toast.success(response.data.data.verified ? "Domain verified" : "Domain not verified yet");

            const latest = await api.get<{ success: boolean; data: DomainSettings }>(API.INTERNAL.INSTITUTE.DOMAIN);
            setDomainSettings(latest.data.data);
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            toast.error(message ?? "Unable to verify domain");
        } finally {
            setDomainVerifying(false);
        }
    };

    const activateDomain = async () => {
        setDomainActivating(true);
        try {
            const response = await api.post<{ success: boolean; data: DomainSettings }>(API.INTERNAL.INSTITUTE.DOMAIN, {
                action: "activate",
                customDomain: domainInput,
            });
            setDomainSettings(response.data.data);
            toast.success("Domain activated");
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            toast.error(message ?? "Unable to activate domain");
        } finally {
            setDomainActivating(false);
        }
    };

    const saveSettings = () => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        toast.success("Settings saved");
    };

    const exportData = async () => {
        setExporting(true);
        try {
            const [studentsRes, leadsRes, coursesRes, feesRes, paymentsRes] = await Promise.all([
                api.get(API.INTERNAL.STUDENTS.ROOT),
                api.get(API.INTERNAL.LEADS.ROOT),
                api.get(API.INTERNAL.COURSES.ROOT),
                api.get(API.INTERNAL.FEES.ROOT),
                api.get(API.INTERNAL.PAYMENTS.ROOT),
            ]);

            const payload = {
                exportedAt: new Date().toISOString(),
                data: {
                    students: studentsRes.data?.data ?? [],
                    leads: leadsRes.data?.data ?? [],
                    courses: coursesRes.data?.data ?? [],
                    fees: feesRes.data?.data ?? [],
                    payments: paymentsRes.data?.data ?? [],
                },
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `oncampus-export-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success("Data export downloaded");
        } catch {
            toast.error("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    return (
        <main className="p-6 space-y-6">
            <div>
                <h1 className=" text-2xl font-semibold">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage appearance, notifications, and dashboard behavior.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Integrations</CardTitle>
                    <CardDescription>Configure sender and event-level notification behavior.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/settings/whatsapp-integration">Settings → WhatsApp Integration</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/settings/notifications">Settings → Notifications</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Choose how OnCampus looks for your workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-w-xs">
                        <Label>Theme</Label>
                        <Select
                            value={mounted ? (theme ?? "system") : "system"}
                            onValueChange={(value) => setTheme(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dashboard Preferences</CardTitle>
                    <CardDescription>Control table density and dashboard behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Compact tables</p>
                            <p className="text-xs text-muted-foreground">Reduce table spacing to fit more rows.</p>
                        </div>
                        <Switch
                            checked={settings.dashboard.compactTables}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    dashboard: { ...prev.dashboard, compactTables: checked },
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Auto refresh dashboard</p>
                            <p className="text-xs text-muted-foreground">Refresh summary cards and key metrics automatically.</p>
                        </div>
                        <Switch
                            checked={settings.dashboard.autoRefreshDashboard}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    dashboard: { ...prev.dashboard, autoRefreshDashboard: checked },
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Show large amounts in lakh format</p>
                            <p className="text-xs text-muted-foreground">Display values like ₹1,50,000 as ₹1.5L where applicable.</p>
                        </div>
                        <Switch
                            checked={settings.dashboard.showAmountsInLakh}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    dashboard: { ...prev.dashboard, showAmountsInLakh: checked },
                                }))
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what updates you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Desktop alerts</p>
                            <p className="text-xs text-muted-foreground">Show browser alerts for important activity.</p>
                        </div>
                        <Switch
                            checked={settings.notifications.desktopAlerts}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, desktopAlerts: checked },
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Fee payment reminders</p>
                            <p className="text-xs text-muted-foreground">Notify when pending fee reminders are due.</p>
                        </div>
                        <Switch
                            checked={settings.notifications.paymentReminders}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, paymentReminders: checked },
                                }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Lead activity alerts</p>
                            <p className="text-xs text-muted-foreground">Notify when leads are added or status changes.</p>
                        </div>
                        <Switch
                            checked={settings.notifications.leadActivityAlerts}
                            onCheckedChange={(checked) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, leadActivityAlerts: checked },
                                }))
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data</CardTitle>
                    <CardDescription>Review usage and export your institute data anytime.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Students</p><p className="text-lg font-semibold">{dataCounts.students}</p></div>
                        <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Leads</p><p className="text-lg font-semibold">{dataCounts.leads}</p></div>
                        <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Courses</p><p className="text-lg font-semibold">{dataCounts.courses}</p></div>
                        <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Payments</p><p className="text-lg font-semibold">{dataCounts.payments}</p></div>
                    </div>

                    <Button variant="outline" onClick={exportData} disabled={exporting}>
                        {exporting ? "Exporting..." : "Export Data"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Domains</CardTitle>
                    <CardDescription>Connect your own domain and activate white-label access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded border p-3">
                            <p className="text-xs text-muted-foreground">Default subdomain</p>
                            <p className="text-sm font-medium">{domainSettings?.defaultDomain || "-"}</p>
                        </div>
                        <div className="rounded border p-3">
                            <p className="text-xs text-muted-foreground">Current status</p>
                            <div className="mt-1">
                                <Badge variant={getStatusVariant(domainSettings?.domainStatus ?? "PENDING")}>
                                    {domainSettings?.domainStatus ?? "PENDING"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="custom-domain">Custom domain</Label>
                        <Input
                            id="custom-domain"
                            value={domainInput}
                            onChange={(event) => setDomainInput(event.target.value)}
                            placeholder="portal.yourinstitute.com"
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">DNS record to add</p>
                        <p className="mt-1">Type: {domainSettings?.dnsInstruction.type ?? "CNAME"}</p>
                        <p>Name: {domainSettings?.dnsInstruction.name ?? "portal"}</p>
                        <p>Target: {domainSettings?.dnsInstruction.target ?? "cname.vercel-dns.com"}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={saveDomain} disabled={domainSaving}>
                            {domainSaving ? "Saving..." : "Save Domain"}
                        </Button>
                        <Button variant="outline" onClick={verifyDomain} disabled={domainVerifying || !domainInput.trim()}>
                            {domainVerifying ? "Verifying..." : "Verify DNS"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={activateDomain}
                            disabled={domainActivating || !domainSettings?.domainVerified}
                        >
                            {domainActivating ? "Activating..." : "Activate Domain"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Settings</Button>
            </div>
        </main>
    );
}
