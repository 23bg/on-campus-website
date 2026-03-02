import type { Metadata } from "next";
import ExcelTemplatesTool from "@/modules/tools/components/ExcelTemplatesTool";

export const metadata: Metadata = {
    title: "Free Excel Templates for Coaching Institutes",
    description: "Download free student, attendance, fees, and leads templates in CSV and Excel format.",
};

export default function TemplatesPage() {
    return (
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Free Excel Templates</h1>
                <p className="text-muted-foreground">Ready-to-use formats for institute operations.</p>
            </div>
            <ExcelTemplatesTool />
        </main>
    );
}
