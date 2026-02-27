"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
    }, []);

    const saveSettings = () => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        toast.success("Settings saved");
    };

    return (
        <main className="p-6 space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage appearance, notifications, and dashboard behavior.</p>
            </div>

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

            <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Settings</Button>
            </div>
        </main>
    );
}
