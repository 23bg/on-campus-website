import { Metadata } from "next";
import { redirect } from "next/navigation";
import { readSessionFromCookie } from "@/lib/auth/auth";

export const metadata: Metadata = {
    title: "Jobs | ATS",
    description: "Job listings and candidate dashboard",
};

export default async function JobsPage() {
    const session = await readSessionFromCookie();

    if (!session) {
        redirect("/auth/candidate/login");
    }

    if (session.role !== "CANDIDATE") {
        redirect("/dashboard");
    }

    return (
        <main className="mx-auto max-w-6xl p-6">
            <h1 className="text-3xl font-bold">Jobs Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome, {session.email}. Browse and apply for roles here.</p>
            <div className="mt-6 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">No jobs available yet. Please check back soon.</p>
            </div>
        </main>
    );
}
