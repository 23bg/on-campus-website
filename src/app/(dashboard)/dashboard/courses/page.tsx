"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, Plus, BookOpen } from "lucide-react";

type Course = {
    id: string;
    name: string;
    duration?: string | null;
    defaultFees?: number | null;
    description?: string | null;
};

type CourseForm = { name: string; duration: string; defaultFees: string; description: string };
const emptyForm: CourseForm = { name: "", duration: "", defaultFees: "", description: "" };

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CourseForm>(emptyForm);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/courses", { cache: "no-store" });
            const json = await res.json();
            setCourses(json.data ?? []);
        } catch {
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (course: Course) => {
        setEditingId(course.id);
        setForm({
            name: course.name,
            duration: course.duration ?? "",
            defaultFees: course.defaultFees?.toString() ?? "",
            description: course.description ?? "",
        });
        setDialogOpen(true);
    };

    const saveCourse = async () => {
        if (!form.name.trim()) {
            toast.error("Course name is required");
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/courses/${editingId}` : "/api/courses";
            const method = editingId ? "PATCH" : "POST";
            const body: Record<string, unknown> = { name: form.name };
            if (form.duration) body.duration = form.duration;
            if (form.defaultFees) body.defaultFees = parseFloat(form.defaultFees);
            if (form.description) body.description = form.description;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error?.message ?? "Failed to save course");
                return;
            }
            toast.success(editingId ? "Course updated" : "Course added");
            setDialogOpen(false);
            await load();
        } catch {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    const deleteCourse = async (id: string) => {
        try {
            const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("Failed to delete course");
                return;
            }
            toast.success("Course deleted");
            await load();
        } catch {
            toast.error("Network error");
        }
    };

    const formatCurrency = (value: number | null | undefined) => {
        if (value == null) return "-";
        return `₹${value.toLocaleString("en-IN")}`;
    };

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold flex items-center gap-2">
                        <BookOpen className="h-6 w-6" /> Courses
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">{courses.length} total courses</p>
                </div>
                <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
            </div>

            <div className="mt-4 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Default Fees</TableHead>
                            <TableHead className="max-w-[200px]">Description</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No courses yet. Add your first course.
                                </TableCell>
                            </TableRow>
                        ) : courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell className="font-medium">{course.name}</TableCell>
                                <TableCell>{course.duration || "-"}</TableCell>
                                <TableCell>{formatCurrency(course.defaultFees)}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{course.description || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(course)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteCourse(course.id)}>
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
                        <DialogTitle>{editingId ? "Edit Course" : "Add Course"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. NEET 2026, JEE Foundation" />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 months, 1 year" />
                        </div>
                        <div className="space-y-2">
                            <Label>Default Fees (₹)</Label>
                            <Input type="number" value={form.defaultFees} onChange={(e) => setForm({ ...form, defaultFees: e.target.value })} placeholder="e.g. 50000" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the course" rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveCourse} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {editingId ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
