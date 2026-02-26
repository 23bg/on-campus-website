"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, Plus, Layers } from "lucide-react";

type Course = { id: string; name: string };
type Teacher = { id: string; name: string; subject?: string | null };
type Batch = {
    id: string;
    courseId: string;
    name: string;
    startDate?: string | null;
    schedule?: string | null;
    teacherId?: string | null;
};

type BatchForm = { courseId: string; name: string; startDate: string; schedule: string; teacherId: string };
const emptyForm: BatchForm = { courseId: "", name: "", startDate: "", schedule: "", teacherId: "" };

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<BatchForm>(emptyForm);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [batchRes, courseRes, teacherRes] = await Promise.all([
                fetch("/api/batches", { cache: "no-store" }),
                fetch("/api/courses", { cache: "no-store" }),
                fetch("/api/teachers", { cache: "no-store" }),
            ]);
            const [batchJson, courseJson, teacherJson] = await Promise.all([
                batchRes.json(), courseRes.json(), teacherRes.json(),
            ]);
            setBatches(batchJson.data ?? []);
            setCourses(courseJson.data ?? []);
            setTeachers(teacherJson.data ?? []);
        } catch {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.name]));
    const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t.name]));

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (batch: Batch) => {
        setEditingId(batch.id);
        setForm({
            courseId: batch.courseId,
            name: batch.name,
            startDate: batch.startDate ? batch.startDate.slice(0, 10) : "",
            schedule: batch.schedule ?? "",
            teacherId: batch.teacherId ?? "",
        });
        setDialogOpen(true);
    };

    const saveBatch = async () => {
        if (!form.courseId || !form.name.trim()) {
            toast.error("Course and batch name are required");
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/batches/${editingId}` : "/api/batches";
            const method = editingId ? "PATCH" : "POST";
            const body: Record<string, unknown> = { courseId: form.courseId, name: form.name };
            if (form.startDate) body.startDate = form.startDate;
            if (form.schedule) body.schedule = form.schedule;
            if (form.teacherId) body.teacherId = form.teacherId;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error?.message ?? "Failed to save batch");
                return;
            }
            toast.success(editingId ? "Batch updated" : "Batch added");
            setDialogOpen(false);
            await load();
        } catch {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    const deleteBatch = async (id: string) => {
        try {
            const res = await fetch(`/api/batches/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("Failed to delete batch");
                return;
            }
            toast.success("Batch deleted");
            await load();
        } catch {
            toast.error("Network error");
        }
    };

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold flex items-center gap-2">
                        <Layers className="h-6 w-6" /> Batches
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">{batches.length} total batches</p>
                </div>
                <Button onClick={openCreate} disabled={courses.length === 0}>
                    <Plus className="mr-2 h-4 w-4" /> Add Batch
                </Button>
            </div>

            {courses.length === 0 && !loading ? (
                <p className="mt-4 text-sm text-muted-foreground">Add courses first before creating batches.</p>
            ) : null}

            <div className="mt-4 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Schedule</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : batches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No batches yet.
                                </TableCell>
                            </TableRow>
                        ) : batches.map((batch) => (
                            <TableRow key={batch.id}>
                                <TableCell className="font-medium">{batch.name}</TableCell>
                                <TableCell>{courseMap[batch.courseId] ?? "-"}</TableCell>
                                <TableCell>{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "-"}</TableCell>
                                <TableCell>{batch.schedule || "-"}</TableCell>
                                <TableCell>{batch.teacherId ? (teacherMap[batch.teacherId] ?? "-") : "-"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(batch)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteBatch(batch.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Batch" : "Add Batch"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Course *</Label>
                            <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Batch Name *</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning Batch, Weekend Batch" />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Schedule</Label>
                            <Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="e.g. Mon-Fri 9AM-12PM" />
                        </div>
                        <div className="space-y-2">
                            <Label>Teacher</Label>
                            <Select value={form.teacherId} onValueChange={(v) => setForm({ ...form, teacherId: v })}>
                                <SelectTrigger><SelectValue placeholder="Assign teacher (optional)" /></SelectTrigger>
                                <SelectContent>
                                    {teachers.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}{t.subject ? ` — ${t.subject}` : ""}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveBatch} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {editingId ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
