"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { API } from "@/constants/api";
import { Button } from "@/components/ui/button";

type PortalData = {
    announcements: Array<{ title: string; body: string; createdAt: string; attachmentUrl?: string | null }>;
};

export default function StudentAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<PortalData["announcements"]>([]);

    useEffect(() => {
        api.get(API.INTERNAL.STUDENT_PORTAL.ME).then((response) => {
            const rows = (response.data?.data?.announcements ?? []) as PortalData["announcements"];
            setAnnouncements(
                [...rows].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
            );
        });
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Announcements</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Institute Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    {announcements.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No announcements yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {announcements.map((item, index) => (
                                <div key={`${item.title}-${index}`} className="rounded-lg border p-4">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                                        {item.attachmentUrl ? (
                                            <Button asChild size="sm" variant="outline">
                                                <a href={item.attachmentUrl} target="_blank" rel="noreferrer">Open Attachment</a>
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
