"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";

type UploadResult = {
    inserted: number;
    errors: Array<{ row: number; message: string }>;
};

export default function UploadPage() {
    const [result, setResult] = useState<UploadResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onUpload = async (file: File) => {
        setFileName(file.name);
        setResult(null);
        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const response = await fetch("/api/students/upload", {
                method: "POST",
                body: formData,
            });
            const json = await response.json();
            if (!response.ok) {
                toast.error(json.error?.message ?? "Upload failed");
                return;
            }
            const data = json.data as UploadResult;
            setResult(data);
            toast.success(`${data.inserted} students imported`);
        } catch {
            toast.error("Network error during upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-6 max-w-2xl">
            <h1 className="font-heading text-2xl font-semibold">Upload Students CSV</h1>
            <p className="mt-1 text-muted-foreground">Bulk import students from a CSV file.</p>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" /> CSV Upload</CardTitle>
                    <CardDescription>Required columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">name</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">phone</code>. Optional: <code className="text-xs bg-muted px-1 py-0.5 rounded">email</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">course</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">batch</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">fees</code></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {fileName ? fileName : "Click to select a CSV file"}
                        </p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpload(file);
                            }}
                        />
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                        </div>
                    ) : null}

                    {result ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">{result.inserted} students imported</span>
                            </div>
                            {result.errors.length > 0 ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium">{result.errors.length} row errors</span>
                                    </div>
                                    <ul className="text-xs text-muted-foreground space-y-1 pl-6">
                                        {result.errors.map((error) => (
                                            <li key={`${error.row}-${error.message}`}>
                                                Row {error.row}: {error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">All rows imported successfully.</p>
                            )}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </main>
    );
}
