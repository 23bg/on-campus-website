"use client";

import { useAuth } from "../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const otpSchema = z.object({
    otp: z.string().regex(/^\d{5}$/, "OTP must be 5 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerificationForm() {
    const [codes, setCodes] = useState(["", "", "", "", ""]);

    const handleCodeChange = (index: number, value: string) => {
        const next = [...codes];
        next[index] = value.slice(0, 1);
        setCodes(next);

        if (value && index < 4) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    const router = useRouter();
    const { verifyOTP, loading } = useAuth();

    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem("login_email");
        if (!storedEmail) {
            toast.error("Session expired, please login again.");
            router.push(ROUTES.AUTH.LOG_IN);
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const form = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        mode: "onBlur",
        defaultValues: { otp: "" },
    });

    const onSubmit = async (data: OtpFormData) => {
        if (!email) return;

        verifyOTP(
            { email, otp: data.otp },
            {
                onSuccess: (result: { redirectTo?: string }) => {
                    toast.success("OTP verified successfully.");
                    localStorage.removeItem("login_email");
                    router.push(result?.redirectTo || "/onboarding");
                },
                onError: (err: any) => {
                    toast.error(typeof err === 'string' ? err : err?.message || "Invalid OTP. Please try again.");
                },
            }
        );
    };

    if (email === null) return null;

    return (
        <Card className="border shadow-none rounded-md">
            <CardHeader>
                <CardTitle className="text-2xl">Verify your account</CardTitle>
                <CardDescription>Enter the 5-digit code sent to your email</CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const finalOtp = codes.join("");
                        form.setValue("otp", finalOtp, { shouldValidate: true, shouldTouch: true });
                        form.handleSubmit(onSubmit)();
                    }}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel className="block text-center">Verification Code</FieldLabel>
                            <Controller
                                name="otp"
                                control={form.control}
                                render={({ fieldState }) => (
                                    <>
                                        <div className="flex justify-center gap-2">
                                            {codes.map((c, i) => (
                                                <Input
                                                    key={i}
                                                    id={`code-${i}`}
                                                    maxLength={1}
                                                    inputMode="numeric"
                                                    value={c}
                                                    onChange={(e) => handleCodeChange(i, e.target.value.replace(/\D/g, ""))}
                                                    className="w-12 h-12 text-xl text-center font-semibold"
                                                    disabled={loading}
                                                />
                                            ))}
                                        </div>
                                        <FieldError errors={[fieldState.error]} className="text-center" />
                                    </>
                                )}
                            />
                        </Field>

                        <Button
                            type="submit"
                            disabled={loading || form.formState.isSubmitting || codes.join("").length !== 5}
                            className="w-full"
                        >
                            {loading || form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

