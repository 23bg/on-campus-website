import Link from "next/link";
import { redirect } from "next/navigation";
import { readStudentSessionFromCookie } from "@/lib/auth/student-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await readStudentSessionFromCookie();
    if (!session) {
        redirect("/student-login");
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <header className="border-b bg-background">
                <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
                    <p className="font-semibold">Student Portal</p>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href="/student">Dashboard</Link>
                        <Link href="/student/course">Course</Link>
                        <Link href="/student/profile">Profile</Link>
                        <Link href="/student/announcements">Announcements</Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-5xl p-4">{children}</main>
        </div>
    );
}
