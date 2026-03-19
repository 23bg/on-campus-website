"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    useActivateWhatsappMutation,
    useConnectWhatsappMutation,
    useGetWhatsappIntegrationQuery,
    useVerifyWhatsappMutation,
    WhatsAppIntegrationState,
} from "@/services/adminDashboard.api";

const DEFAULT_STATE: WhatsAppIntegrationState = {
    mode: "ONCAMPUS_SHARED",
    connectedNumber: null,
    status: "DISCONNECTED",
    phoneNumberId: null,
    businessAccountId: null,
    connectedAt: null,
};

export default function WhatsAppIntegrationPage() {
    const { data: state = DEFAULT_STATE, isLoading: loading, refetch } = useGetWhatsappIntegrationQuery();
    const [connectWhatsapp, { isLoading: connecting }] = useConnectWhatsappMutation();
    const [verifyWhatsapp, { isLoading: verifying }] = useVerifyWhatsappMutation();
    const [activateWhatsapp, { isLoading: activating }] = useActivateWhatsappMutation();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [phoneNumberId, setPhoneNumberId] = useState("");
    const [businessAccountId, setBusinessAccountId] = useState("");

    useEffect(() => {
        setPhoneNumber(state.connectedNumber ?? "");
        setPhoneNumberId(state.phoneNumberId ?? "");
        setBusinessAccountId(state.businessAccountId ?? "");
    }, [state.businessAccountId, state.connectedNumber, state.phoneNumberId]);

    const connect = async () => {
        try {
            const response = await connectWhatsapp(phoneNumber).unwrap();
            const otpHint = response.otpHint;
            toast.success(otpHint ? `OTP sent. Use ${otpHint} in this environment.` : "OTP sent");
            await refetch();
        } catch (error: any) {
            toast.error(error?.data?.error?.message ?? "Unable to initiate connection");
        }
    };

    const verify = async () => {
        try {
            await verifyWhatsapp(otp).unwrap();
            toast.success("Number verified");
            await refetch();
        } catch (error: any) {
            toast.error(error?.data?.error?.message ?? "Unable to verify OTP");
        }
    };

    const activate = async () => {
        try {
            await activateWhatsapp({ phoneNumberId, businessAccountId }).unwrap();
            toast.success("Institute WhatsApp number activated");
            await refetch();
        } catch (error: any) {
            toast.error(error?.data?.error?.message ?? "Unable to activate number");
        }
    };

    if (loading) {
        return <main className="p-6">Loading...</main>;
    }

    return (
        <main className="p-6 space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-semibold">WhatsApp Integration</h1>
                <p className="text-sm text-muted-foreground mt-1">Connect your institute WhatsApp Business number while OnCampus continues to manage alert billing and usage.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Messaging Sender</CardTitle>
                    <CardDescription>Current sender mode and connection status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Mode</span>
                        <span className="font-medium">
                            {state.mode === "INSTITUTE_CUSTOM" ? "Institute WhatsApp Number" : "OnCampus System Number"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Connected Number</span>
                        <span className="font-medium">{state.connectedNumber ?? "Not connected"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={state.status === "ACTIVE" ? "default" : "secondary"}>{state.status}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connect WhatsApp Number</CardTitle>
                    <CardDescription>Complete all 3 steps to activate your institute sender.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">1. Enter phone number</p>
                        <div className="flex gap-2">
                            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91XXXXXXXXXX" />
                            <Button disabled={connecting || verifying || activating} onClick={() => void connect()}>Connect WhatsApp Number</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">2. Verify OTP</p>
                        <div className="flex gap-2">
                            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                            <Button variant="outline" disabled={connecting || verifying || activating} onClick={() => void verify()}>Verify OTP</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">3. Activate number</p>
                        <Input value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} placeholder="Phone Number ID" />
                        <Input value={businessAccountId} onChange={(e) => setBusinessAccountId(e.target.value)} placeholder="Business Account ID" />
                        <Button variant="outline" disabled={connecting || verifying || activating} onClick={() => void activate()}>Activate Number</Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
