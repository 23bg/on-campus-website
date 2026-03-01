"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

type PortalData = {
    student: {
        name: string;
        admissionDate: string;
        course?: { name: string; duration?: string | null } | null;
        batch?: { name: string; startDate?: string | null } | null;
    };
};

export default function StudentDashboardPage() {
    const [data, setData] = useState<PortalData | null>(null);

    useEffect(() => {
        api.get("/student-portal/me").then((response) => {
            setData(response.data?.data ?? null);
        });
    }, []);

    const logout = async () => {
        await api.post("/student-auth/logout");
        window.location.href = "/student-login";
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">My Dashboard</h1>
                <Button variant="outline" onClick={logout}>Logout</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="text-base">My Course</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Course:</span> {data?.student.course?.name ?? "-"}</p>
                        <p><span className="text-muted-foreground">Duration:</span> {data?.student.course?.duration ?? "-"}</p>
                        <p><span className="text-muted-foreground">Batch:</span> {data?.student.batch?.name ?? "-"}</p>
                        <p><span className="text-muted-foreground">Start Date:</span> {data?.student.batch?.startDate ? new Date(data.student.batch.startDate).toLocaleDateString() : "-"}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Online Links</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Live Class Link:</span> Not provided</p>
                        <p><span className="text-muted-foreground">Recorded Class Links:</span> Not provided</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
