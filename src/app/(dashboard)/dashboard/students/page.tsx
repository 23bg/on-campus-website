"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";

type Course = { id: string; name: string; defaultFees?: number | null };
type Batch = { id: string; courseId: string; name: string };
type FeeSummary = { totalFees: number; totalPaid: number; totalPending: number };
type Student = {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    courseId?: string | null;
    batchId?: string | null;
    admissionDate?: string | null;
};

type StudentForm = { name: string; phone: string; email: string; courseId: string; batchId: string; admissionDate: string; fees: string };
const emptyForm: StudentForm = { name: "", phone: "", email: "", courseId: "", batchId: "", admissionDate: "", fees: "" };

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [feeSummaries, setFeeSummaries] = useState<Record<string, FeeSummary>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<StudentForm>(emptyForm);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [studentRes, courseRes, batchRes] = await Promise.all([
                fetch("/api/students", { cache: "no-store" }),
                fetch("/api/courses", { cache: "no-store" }),
                fetch("/api/batches", { cache: "no-store" }),
            ]);
            const [studentJson, courseJson, batchJson] = await Promise.all([
                studentRes.json(), courseRes.json(), batchRes.json(),
            ]);
            const studentList: Student[] = studentJson.data ?? [];
            setStudents(studentList);
            setCourses(courseJson.data ?? []);
            setBatches(batchJson.data ?? []);

            // Load fee summaries for all students
            const summaries: Record<string, FeeSummary> = {};
            await Promise.all(
                studentList.map(async (s) => {
                    try {
                        const res = await fetch(`/api/fees?studentId=${s.id}`, { cache: "no-store" });
                        const json = await res.json();
                        if (json.data) {
                            summaries[s.id] = {
                                totalFees: json.data.totalFees ?? 0,
                                totalPaid: json.data.totalPaid ?? 0,
                                totalPending: json.data.totalPending ?? 0,
                            };
                        }
                    } catch {
                        // ignore
                    }
                })
            );
            setFeeSummaries(summaries);
        } catch {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));
    const batchMap = Object.fromEntries(batches.map((b) => [b.id, b.name]));
    const filteredBatches = form.courseId ? batches.filter((b) => b.courseId === form.courseId) : batches;

    const handleCourseChange = (courseId: string) => {
        const course = courseMap[courseId];
        setForm({
            ...form,
            courseId,
            batchId: "",
            fees: course?.defaultFees ? course.defaultFees.toString() : "",
        });
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (student: Student) => {
        setEditingId(student.id);
        setForm({
            name: student.name,
            phone: student.phone,
            email: student.email ?? "",
            courseId: student.courseId ?? "",
            batchId: student.batchId ?? "",
            admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : "",
            fees: "",
        });
        setDialogOpen(true);
    };

    const saveStudent = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            toast.error("Name and phone are required");
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/students/${editingId}` : "/api/students";
            const method = editingId ? "PATCH" : "POST";
            const body: Record<string, unknown> = { name: form.name, phone: form.phone };
            if (form.email) body.email = form.email;
            if (form.courseId) body.courseId = form.courseId;
            if (form.batchId) body.batchId = form.batchId;
            if (form.admissionDate) body.admissionDate = form.admissionDate;
            if (!editingId && form.fees) body.fees = parseFloat(form.fees);

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error?.message ?? "Failed to save student");
                return;
            }
            toast.success(editingId ? "Student updated" : "Student added");
            setDialogOpen(false);
            await load();
        } catch {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    const deleteStudent = async (id: string) => {
        try {
            const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("Failed to delete student");
                return;
            }
            toast.success("Student deleted");
            await load();
        } catch {
            toast.error("Network error");
        }
    };

    const formatCurrency = (v: number) => v > 0 ? `₹${v.toLocaleString("en-IN")}` : "-";

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold">Students</h1>
                    <p className="text-muted-foreground text-sm mt-1">{students.length} total students</p>
                </div>
                <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Student</Button>
            </div>

            <div className="mt-4 rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead className="text-right">Total Fees</TableHead>
                            <TableHead className="text-right">Paid</TableHead>
                            <TableHead className="text-right">Pending</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No students yet. Add your first student.
                                </TableCell>
                            </TableRow>
                        ) : students.map((student) => {
                            const fee = feeSummaries[student.id];
                            return (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.phone}</TableCell>
                                    <TableCell>{student.courseId ? (courseMap[student.courseId]?.name ?? "-") : "-"}</TableCell>
                                    <TableCell>{student.batchId ? (batchMap[student.batchId] ?? "-") : "-"}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(fee?.totalFees ?? 0)}</TableCell>
                                    <TableCell className="text-right text-green-600">{formatCurrency(fee?.totalPaid ?? 0)}</TableCell>
                                    <TableCell className="text-right text-red-600">{formatCurrency(fee?.totalPending ?? 0)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(student)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteStudent(student.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Student" : "Add Student"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Student name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone *</Label>
                            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (optional)" />
                        </div>
                        <div className="space-y-2">
                            <Label>Course</Label>
                            <Select value={form.courseId} onValueChange={handleCourseChange}>
                                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Batch</Label>
                            <Select value={form.batchId} onValueChange={(v) => setForm({ ...form, batchId: v })} disabled={!form.courseId}>
                                <SelectTrigger><SelectValue placeholder={form.courseId ? "Select batch" : "Select course first"} /></SelectTrigger>
                                <SelectContent>
                                    {filteredBatches.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Admission Date</Label>
                            <Input type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
                        </div>
                        {!editingId ? (
                            <div className="space-y-2">
                                <Label>Fees (₹)</Label>
                                <Input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} placeholder="Auto-filled from course" />
                                <p className="text-xs text-muted-foreground">Auto-filled from course default fees. A fee plan will be created automatically.</p>
                            </div>
                        ) : null}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveStudent} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {editingId ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
