"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { API } from "@/constants/api";

type FooterData = {
    student?: {
        institute?: {
            name?: string | null;
        } | null;
    };
};

export default function StudentPortalFooter() {
    const [instituteName, setInstituteName] = useState("Institute Name");

    useEffect(() => {
        api.get(API.INTERNAL.STUDENT_PORTAL.ME).then((response) => {
            const name = response.data?.data?.student?.institute?.name?.trim();
            if (name) setInstituteName(name);
        });
    }, []);

    return (
        <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>© 2026 {instituteName}</span>
                <span>Powered by OnCampus</span>
            </div>
        </footer>
    );
}
