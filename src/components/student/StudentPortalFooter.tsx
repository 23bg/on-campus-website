"use client";

import { useGetStudentPortalQuery } from "@/services/appUi.api";

export default function StudentPortalFooter() {
    const { data } = useGetStudentPortalQuery();
    const instituteName = data?.student?.institute?.name?.trim() || "Institute Name";

    return (
        <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>© 2026 {instituteName}</span>
                <span>Powered by OnCampus</span>
            </div>
        </footer>
    );
}
