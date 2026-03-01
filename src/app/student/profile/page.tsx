"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

type PortalData = {
    student: {
        name: string;
        admissionDate: string;
        course?: { name: string } | null;
        batch?: { name: string } | null;
        institute?: { name?: string | null } | null;
    };
};

export default function StudentProfilePage() {
    const [data, setData] = useState<PortalData | null>(null);

    useEffect(() => {
        api.get("/student-portal/me").then((response) => {
            setData(response.data?.data ?? null);
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {data?.student.name ?? "-"}</p>
                <p><span className="text-muted-foreground">Course:</span> {data?.student.course?.name ?? "-"}</p>
                <p><span className="text-muted-foreground">Batch:</span> {data?.student.batch?.name ?? "-"}</p>
                <p><span className="text-muted-foreground">Admission Date:</span> {data?.student.admissionDate ? new Date(data.student.admissionDate).toLocaleDateString() : "-"}</p>
                <p><span className="text-muted-foreground">Institute:</span> {data?.student.institute?.name ?? "-"}</p>
            </CardContent>
        </Card>
    );
}
