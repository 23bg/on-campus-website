"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { API } from "@/constants/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type NotificationPreferences = {
    newEnquiryAlert: boolean;
    followUpReminder: boolean;
    leadAssigned: boolean;
    paymentReceived: boolean;
    admissionConfirmed: boolean;
};

const DEFAULT_PREFS: NotificationPreferences = {
    newEnquiryAlert: true,
    followUpReminder: true,
    leadAssigned: true,
    paymentReceived: true,
    admissionConfirmed: true,
};

export default function NotificationSettingsPage() {
    const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const response = await api.get<{ success: boolean; data: NotificationPreferences }>(API.INTERNAL.INSTITUTE.NOTIFICATIONS);
            setPrefs({ ...DEFAULT_PREFS, ...(response.data.data ?? {}) });
        } catch {
            toast.error("Failed to load notification settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const update = async (key: keyof NotificationPreferences, value: boolean) => {
        const next = { ...prefs, [key]: value };
        setPrefs(next);

        try {
            await api.put(API.INTERNAL.INSTITUTE.NOTIFICATIONS, { [key]: value });
            toast.success("Notification settings updated");
        } catch {
            setPrefs(prefs);
            toast.error("Failed to update notification settings");
        }
    };

    if (loading) {
        return <main className="p-6">Loading...</main>;
    }

    return (
        <main className="p-6 space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className="text-sm text-muted-foreground mt-1">Enable or disable platform-managed WhatsApp notification events.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Notifications</CardTitle>
                    <CardDescription>Template text is managed by OnCampus and cannot be edited.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ToggleRow
                        label="New enquiry alert"
                        checked={prefs.newEnquiryAlert}
                        onCheckedChange={(checked) => void update("newEnquiryAlert", checked)}
                    />
                    <ToggleRow
                        label="Follow-up reminder"
                        checked={prefs.followUpReminder}
                        onCheckedChange={(checked) => void update("followUpReminder", checked)}
                    />
                    <ToggleRow
                        label="Payment received"
                        checked={prefs.paymentReceived}
                        onCheckedChange={(checked) => void update("paymentReceived", checked)}
                    />
                    <ToggleRow
                        label="Lead assigned"
                        checked={prefs.leadAssigned}
                        onCheckedChange={(checked) => void update("leadAssigned", checked)}
                    />
                    <ToggleRow
                        label="Admission confirmed"
                        checked={prefs.admissionConfirmed}
                        onCheckedChange={(checked) => void update("admissionConfirmed", checked)}
                    />
                </CardContent>
            </Card>
        </main>
    );
}

function ToggleRow(props: {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{props.label}</p>
            <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
        </div>
    );
}
