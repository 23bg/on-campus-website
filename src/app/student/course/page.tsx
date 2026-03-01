"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

type PortalData = {
    student: {
        course?: { name: string; duration?: string | null; description?: string | null } | null;
        batch?: { name: string } | null;
    };
};

export default function StudentCoursePage() {
    const [data, setData] = useState<PortalData | null>(null);

    useEffect(() => {
        api.get("/student-portal/me").then((response) => {
            setData(response.data?.data ?? null);
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Course Name:</span> {data?.student.course?.name ?? "-"}</p>
                <p><span className="text-muted-foreground">Batch:</span> {data?.student.batch?.name ?? "-"}</p>
                <p><span className="text-muted-foreground">Subjects:</span> Managed by institute</p>
                <p><span className="text-muted-foreground">Online Class Links:</span> External links only</p>
                <p><span className="text-muted-foreground">Recorded Class Links:</span> External links only</p>
            </CardContent>
        </Card>
    );
}
