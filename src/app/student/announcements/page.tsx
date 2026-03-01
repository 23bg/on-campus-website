"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

type PortalData = {
    announcements: Array<{ title: string; body: string; createdAt: string }>;
};

export default function StudentAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<PortalData["announcements"]>([]);

    useEffect(() => {
        api.get("/student-portal/me").then((response) => {
            setAnnouncements(response.data?.data?.announcements ?? []);
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
                {announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No announcements yet.</p>
                ) : (
                    <div className="space-y-3">
                        {announcements.map((item, index) => (
                            <div key={`${item.title}-${index}`} className="rounded border p-3">
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-sm mt-1">{item.body}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
