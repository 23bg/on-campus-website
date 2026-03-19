import { baseApi } from "@/services/api";
import { API } from "@/constants/api";
import apiClient from "@/lib/axios";

export type Course = { id: string; name: string; banner?: string | null; duration?: string | null; defaultFees?: number | null; description?: string | null };
export type Teacher = { id: string; name: string; subject?: string | null; bio?: string | null };
export type Batch = { id: string; courseId: string; name: string; startDate?: string | null; schedule?: string | null; teacherId?: string | null };
export type Student = { id: string; name: string; phone: string; email?: string | null; courseId?: string | null; batchId?: string | null; admissionDate?: string | null };
export type FeeSummary = { totalFees: number; totalPaid: number; totalPending: number };
export type StudentAssignment = { id: string; courseId: string; batchId?: string | null; joinedAt: string; status: "ACTIVE" | "COMPLETED" | "DROPPED"; courseName: string; batchName?: string | null; batchStartDate?: string | null };
export type UploadResult = { inserted: number; errors: Array<{ row: number; message: string }> };
export type BatchNote = { id: string; title: string; description?: string | null; fileUrl?: string | null; createdAt: string };
export type BatchAttendance = { id: string; studentId: string; date: string; status: "PRESENT" | "ABSENT" };
export type FeePlan = { id: string; studentId: string; totalAmount: number; dueDate?: string | null; createdAt: string };
export type Payment = { id: string; feePlanId: string; amount: number; status: "PENDING" | "PAID" | "OVERDUE"; paidOn?: string | null; note?: string | null };
export type PaymentRow = { id: string; amount: number; method?: string | null; reference?: string | null; paidOn: string; student: { id: string; name: string; phone: string } };
export type Defaulter = { studentId: string; studentName: string; phone: string; courseName: string; totalFees: number; totalPaid: number; pending: number; dueDate?: string | null };
export type Lead = { id: string; name: string; phone: string; email?: string | null; course?: string | null; source?: string | null; status: string; message?: string | null; followUpAt?: string | null; createdAt: string };
export type LeadActivity = { activityType: string; title: string; description?: string; createdAt: string };
export type LeadImportSummary = { totalRows: number; validRows: number; failedRows: number; duplicateRows: number; imported: number; errors: Array<{ row: number; message: string }>; duplicates: Array<{ row: number; phone: string }>; preview: Array<{ name: string; email?: string; phone: string; course?: string; source?: string; city?: string }> };
export type TeamRow = { id: string; name: string; phone: string; email: string; role: "OWNER" | "MANAGER" | "COUNSELOR" | "TEACHER" | "VIEWER"; active: boolean; subjects?: string; experience?: string; bio?: string; source: "team" | "teacher" };
export type TeamFormValues = { name: string; phone: string; email: string; role: "OWNER" | "MANAGER" | "COUNSELOR" | "TEACHER" | "VIEWER"; active: boolean; subjects: string; experience: string; bio: string };
export type TeamData = { rows: TeamRow[]; sessionRole: "OWNER" | "MANAGER" | "VIEWER" | null };
export type StudentsDashboardData = { rows: Student[]; courses: Course[]; batches: Batch[]; feeSummaries: Record<string, FeeSummary> };
export type BatchesDashboardData = { rows: Batch[]; courses: Course[]; teachers: Teacher[]; students: Student[] };
export type BatchDetails = { notes: BatchNote[]; attendance: BatchAttendance[] };
export type FeesDashboardData = { plans: FeePlan[]; students: Student[] };

const safeData = <T>(response: any): T => (response?.data?.data ?? response?.data ?? null) as T;

export const dashboardTablesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query<Course[], void>({
            query: () => ({ url: API.INTERNAL.COURSES.ROOT }),
            providesTags: (result) => result ? [...result.map((item) => ({ type: "Courses" as const, id: item.id })), { type: "Courses", id: "LIST" }] : [{ type: "Courses", id: "LIST" }],
        }),
        saveCourse: builder.mutation<void, { editingId: string | null; body: Record<string, unknown> }>({
            query: ({ editingId, body }) => ({ url: editingId ? API.INTERNAL.COURSES.BY_ID(editingId) : API.INTERNAL.COURSES.ROOT, method: editingId ? "patch" : "post", data: body }),
            invalidatesTags: [{ type: "Courses", id: "LIST" }],
        }),
        deleteCourse: builder.mutation<void, string>({
            query: (id) => ({ url: API.INTERNAL.COURSES.BY_ID(id), method: "delete" }),
            invalidatesTags: [{ type: "Courses", id: "LIST" }],
        }),
        getTeachers: builder.query<Teacher[], void>({
            query: () => ({ url: API.INTERNAL.TEACHERS.ROOT }),
            providesTags: (result) => result ? [...result.map((item) => ({ type: "Teachers" as const, id: item.id })), { type: "Teachers", id: "LIST" }] : [{ type: "Teachers", id: "LIST" }],
        }),
        saveTeacher: builder.mutation<void, { editingId: string | null; body: Record<string, unknown> }>({
            query: ({ editingId, body }) => ({ url: editingId ? API.INTERNAL.TEACHERS.BY_ID(editingId) : API.INTERNAL.TEACHERS.ROOT, method: editingId ? "patch" : "post", data: body }),
            invalidatesTags: [{ type: "Teachers", id: "LIST" }, { type: "Team", id: "LIST" }, { type: "Batches", id: "LIST" }],
        }),
        deleteTeacher: builder.mutation<void, string>({
            query: (id) => ({ url: API.INTERNAL.TEACHERS.BY_ID(id), method: "delete" }),
            invalidatesTags: [{ type: "Teachers", id: "LIST" }, { type: "Team", id: "LIST" }, { type: "Batches", id: "LIST" }],
        }),
        getStudentsDashboard: builder.query<StudentsDashboardData, void>({
            async queryFn() {
                try {
                    const [studentsRes, coursesRes, batchesRes] = await Promise.all([apiClient.get(API.INTERNAL.STUDENTS.ROOT), apiClient.get(API.INTERNAL.COURSES.ROOT), apiClient.get(API.INTERNAL.BATCHES.ROOT)]);
                    const students = safeData<Student[]>(studentsRes) ?? [];
                    const feeSummaries: Record<string, FeeSummary> = {};
                    await Promise.all(students.map(async (student) => {
                        try {
                            const feeRes = await apiClient.get(API.INTERNAL.FEES.WITH_STUDENT(student.id));
                            const feeData = safeData<any>(feeRes);
                            feeSummaries[student.id] = { totalFees: feeData?.totalFees ?? 0, totalPaid: feeData?.totalPaid ?? 0, totalPending: feeData?.totalPending ?? 0 };
                        } catch {
                            feeSummaries[student.id] = { totalFees: 0, totalPaid: 0, totalPending: 0 };
                        }
                    }));
                    return { data: { rows: students, courses: safeData<Course[]>(coursesRes) ?? [], batches: safeData<Batch[]>(batchesRes) ?? [], feeSummaries } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            providesTags: [{ type: "Students", id: "LIST" }, { type: "Courses", id: "LIST" }, { type: "Batches", id: "LIST" }],
        }),
        saveStudent: builder.mutation<void, { editingId: string | null; body: Record<string, unknown> }>({
            query: ({ editingId, body }) => ({ url: editingId ? API.INTERNAL.STUDENTS.BY_ID(editingId) : API.INTERNAL.STUDENTS.ROOT, method: editingId ? "patch" : "post", data: body }),
            invalidatesTags: [{ type: "Students", id: "LIST" }, { type: "Fees", id: "LIST" }],
        }),
        deleteStudent: builder.mutation<void, string>({
            query: (id) => ({ url: API.INTERNAL.STUDENTS.BY_ID(id), method: "delete" }),
            invalidatesTags: [{ type: "Students", id: "LIST" }, { type: "Fees", id: "LIST" }, { type: "Payments", id: "LIST" }],
        }),
        getStudentAssignments: builder.query<StudentAssignment[], string>({ query: (studentId) => ({ url: API.INTERNAL.STUDENTS.COURSES(studentId) }), providesTags: (_r, _e, studentId) => [{ type: "StudentAssignments", id: studentId }] }),
        assignStudentCourse: builder.mutation<StudentAssignment[], { studentId: string; body: { courseId: string; batchId?: string } }>({
            async queryFn({ studentId, body }) {
                try {
                    await apiClient.post(API.INTERNAL.STUDENTS.COURSES(studentId), body);
                    const response = await apiClient.get(API.INTERNAL.STUDENTS.COURSES(studentId));
                    return { data: safeData<StudentAssignment[]>(response) ?? [] };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: (_r, _e, { studentId }) => [{ type: "Students", id: "LIST" }, { type: "StudentAssignments", id: studentId }],
        }),
        updateStudentPortalCredentials: builder.mutation<void, { studentId: string; body: { username: string; email: string; password: string } }>({
            query: ({ studentId, body }) => ({ url: `/students/${studentId}/portal-credentials`, method: "patch", data: body }),
        }),
        uploadStudentsCsv: builder.mutation<UploadResult, File>({
            async queryFn(file) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await apiClient.post(API.INTERNAL.STUDENTS.UPLOAD, formData, { headers: { "Content-Type": "multipart/form-data" } });
                    return { data: safeData<UploadResult>(response) };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: [{ type: "Students", id: "LIST" }, { type: "Fees", id: "LIST" }],
        }),
        getBatchesDashboard: builder.query<BatchesDashboardData, void>({
            async queryFn() {
                try {
                    const [batchesRes, coursesRes, teachersRes, studentsRes] = await Promise.all([apiClient.get(API.INTERNAL.BATCHES.ROOT), apiClient.get(API.INTERNAL.COURSES.ROOT), apiClient.get(API.INTERNAL.TEACHERS.ROOT), apiClient.get(API.INTERNAL.STUDENTS.ROOT)]);
                    return { data: { rows: safeData<Batch[]>(batchesRes) ?? [], courses: safeData<Course[]>(coursesRes) ?? [], teachers: safeData<Teacher[]>(teachersRes) ?? [], students: safeData<Student[]>(studentsRes) ?? [] } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            providesTags: [{ type: "Batches", id: "LIST" }, { type: "Courses", id: "LIST" }, { type: "Teachers", id: "LIST" }, { type: "Students", id: "LIST" }],
        }),
        saveBatch: builder.mutation<void, { editingId: string | null; body: Record<string, unknown> }>({ query: ({ editingId, body }) => ({ url: editingId ? API.INTERNAL.BATCHES.BY_ID(editingId) : API.INTERNAL.BATCHES.ROOT, method: editingId ? "patch" : "post", data: body }), invalidatesTags: [{ type: "Batches", id: "LIST" }] }),
        deleteBatch: builder.mutation<void, string>({ query: (id) => ({ url: API.INTERNAL.BATCHES.BY_ID(id), method: "delete" }), invalidatesTags: [{ type: "Batches", id: "LIST" }] }),
        getBatchDetails: builder.query<BatchDetails, string>({
            async queryFn(batchId) {
                try {
                    const [notesResponse, attendanceResponse] = await Promise.all([apiClient.get(`${API.INTERNAL.NOTES.ROOT}?batchId=${batchId}&page=1&pageSize=10`), apiClient.get(`${API.INTERNAL.ATTENDANCE.ROOT}?batchId=${batchId}`)]);
                    return { data: { notes: notesResponse.data?.data?.items ?? [], attendance: safeData<BatchAttendance[]>(attendanceResponse) ?? [] } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            providesTags: (_r, _e, batchId) => [{ type: "BatchDetails", id: batchId }],
        }),
        addBatchNote: builder.mutation<BatchDetails, { batchId: string; courseId: string; body: { title: string; description?: string; fileUrl?: string } }>({
            async queryFn({ batchId, courseId, body }) {
                try {
                    await apiClient.post(API.INTERNAL.NOTES.ROOT, { ...body, batchId, courseId });
                    const [notesResponse, attendanceResponse] = await Promise.all([apiClient.get(`${API.INTERNAL.NOTES.ROOT}?batchId=${batchId}&page=1&pageSize=10`), apiClient.get(`${API.INTERNAL.ATTENDANCE.ROOT}?batchId=${batchId}`)]);
                    return { data: { notes: notesResponse.data?.data?.items ?? [], attendance: safeData<BatchAttendance[]>(attendanceResponse) ?? [] } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: (_r, _e, { batchId }) => [{ type: "BatchDetails", id: batchId }],
        }),
        addBatchAttendance: builder.mutation<BatchDetails, { batchId: string; courseId: string; body: { studentId: string; date: string; status: "PRESENT" | "ABSENT" } }>({
            async queryFn({ batchId, courseId, body }) {
                try {
                    await apiClient.post(API.INTERNAL.ATTENDANCE.ROOT, { ...body, batchId, courseId });
                    const [notesResponse, attendanceResponse] = await Promise.all([apiClient.get(`${API.INTERNAL.NOTES.ROOT}?batchId=${batchId}&page=1&pageSize=10`), apiClient.get(`${API.INTERNAL.ATTENDANCE.ROOT}?batchId=${batchId}`)]);
                    return { data: { notes: notesResponse.data?.data?.items ?? [], attendance: safeData<BatchAttendance[]>(attendanceResponse) ?? [] } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: (_r, _e, { batchId }) => [{ type: "BatchDetails", id: batchId }],
        }),
        getFeesDashboard: builder.query<FeesDashboardData, void>({
            async queryFn() {
                try {
                    const [plansRes, studentsRes] = await Promise.all([apiClient.get(API.INTERNAL.FEES.ROOT), apiClient.get(API.INTERNAL.STUDENTS.ROOT)]);
                    return { data: { plans: safeData<FeePlan[]>(plansRes) ?? [], students: safeData<Student[]>(studentsRes) ?? [] } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            providesTags: [{ type: "Fees", id: "LIST" }, { type: "Students", id: "LIST" }],
        }),
        saveFeePlan: builder.mutation<void, Record<string, unknown>>({ query: (body) => ({ url: API.INTERNAL.FEES.ROOT, method: "post", data: body }), invalidatesTags: [{ type: "Fees", id: "LIST" }] }),
        deleteFeePlan: builder.mutation<void, string>({ query: (id) => ({ url: API.INTERNAL.FEES.BY_ID(id), method: "delete" }), invalidatesTags: [{ type: "Fees", id: "LIST" }, { type: "FeePayments", id: "LIST" }] }),
        getFeePlanPayments: builder.query<Payment[], string>({ query: (planId) => ({ url: API.INTERNAL.FEES.INSTALLMENTS(planId) }), providesTags: (_r, _e, planId) => [{ type: "FeePayments", id: planId }] }),
        addFeePlanPayment: builder.mutation<Payment[], { planId: string; body: Record<string, unknown> }>({
            async queryFn({ planId, body }) {
                try {
                    await apiClient.post(API.INTERNAL.FEES.INSTALLMENTS(planId), body);
                    const response = await apiClient.get(API.INTERNAL.FEES.INSTALLMENTS(planId));
                    return { data: safeData<Payment[]>(response) ?? [] };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: (_r, _e, { planId }) => [{ type: "FeePayments", id: planId }, { type: "Payments", id: "LIST" }, { type: "Defaulters", id: "LIST" }],
        }),
        getPayments: builder.query<PaymentRow[], string>({ query: (queryString) => ({ url: `${API.INTERNAL.PAYMENTS.ROOT}${queryString ? `?${queryString}` : ""}` }), providesTags: [{ type: "Payments", id: "LIST" }] }),
        getDefaulters: builder.query<Defaulter[], void>({ query: () => ({ url: API.INTERNAL.DASHBOARD.DEFAULTERS }), providesTags: [{ type: "Defaulters", id: "LIST" }] }),
        getLeads: builder.query<Lead[], string>({ query: (queryString) => ({ url: `${API.INTERNAL.LEADS.ROOT}${queryString ? `?${queryString}` : ""}` }), providesTags: [{ type: "Leads", id: "LIST" }] }),
        updateLead: builder.mutation<void, { id: string; body: Record<string, unknown> }>({ query: ({ id, body }) => ({ url: API.INTERNAL.LEADS.BY_ID(id), method: "patch", data: body }), invalidatesTags: [{ type: "Leads", id: "LIST" }] }),
        getLeadTimeline: builder.query<LeadActivity[], string>({ query: (leadId) => ({ url: API.INTERNAL.LEADS.TIMELINE(leadId) }), providesTags: (_r, _e, leadId) => [{ type: "LeadTimeline", id: leadId }] }),
        downloadLeadImportTemplate: builder.mutation<Blob, "csv" | "xlsx" | "json">({ query: (format) => ({ url: `${API.INTERNAL.LEADS.IMPORT}?format=${format}`, method: "get", responseType: "blob" }) }),
        previewLeadImport: builder.mutation<LeadImportSummary, File>({
            async queryFn(file) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("dryRun", "true");
                    const response = await apiClient.post(API.INTERNAL.LEADS.IMPORT, formData, { headers: { "Content-Type": "multipart/form-data" } });
                    return { data: safeData<LeadImportSummary>(response) };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
        }),
        confirmLeadImport: builder.mutation<LeadImportSummary, File>({
            async queryFn(file) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("dryRun", "false");
                    const response = await apiClient.post(API.INTERNAL.LEADS.IMPORT, formData, { headers: { "Content-Type": "multipart/form-data" } });
                    return { data: safeData<LeadImportSummary>(response) };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: [{ type: "Leads", id: "LIST" }],
        }),
        getTeamData: builder.query<TeamData, void>({
            async queryFn() {
                try {
                    const [sessionRes, teamsRes, teachersRes] = await Promise.all([apiClient.get(API.INTERNAL.AUTH.ME), apiClient.get(API.INTERNAL.TEAMS.ROOT), apiClient.get(API.INTERNAL.TEACHERS.ROOT)]);
                    const sessionData = safeData<any>(sessionRes);
                    const teamRows: TeamRow[] = (safeData<any[]>(teamsRes) ?? []).map((member) => ({ id: member.id, name: member.name ?? member.email ?? "Unknown", phone: "", email: member.email ?? "", role: member.role, active: true, source: "team" }));
                    const teacherRows: TeamRow[] = (safeData<any[]>(teachersRes) ?? []).map((teacher) => ({ id: teacher.id, name: teacher.name, phone: "", email: "", role: "TEACHER", active: true, subjects: teacher.subject ?? "", experience: "", bio: teacher.bio ?? "", source: "teacher" }));
                    return { data: { rows: [...teamRows, ...teacherRows], sessionRole: sessionData?.user?.role ?? null } };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            providesTags: [{ type: "Team", id: "LIST" }],
        }),
        saveTeamMember: builder.mutation<void, { values: TeamFormValues; editing: TeamRow | null }>({
            async queryFn({ values, editing }) {
                try {
                    if (values.role === "TEACHER") {
                        const payload = { name: values.name, subject: values.subjects || undefined, bio: values.bio || undefined };
                        if (editing?.source === "teacher") {
                            await apiClient.patch(API.INTERNAL.TEACHERS.BY_ID(editing.id), payload);
                        } else {
                            await apiClient.post(API.INTERNAL.TEACHERS.ROOT, payload);
                        }
                    } else {
                        const mappedRole = values.role === "VIEWER" ? "VIEWER" : "MANAGER";
                        if (editing?.source === "team") {
                            await apiClient.patch(API.INTERNAL.TEAMS.BY_ID(editing.id), { role: mappedRole });
                        } else {
                            await apiClient.post(API.INTERNAL.TEAMS.ROOT, { name: values.name, email: values.email, role: mappedRole });
                        }
                    }
                    return { data: undefined };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: [{ type: "Team", id: "LIST" }, { type: "Teachers", id: "LIST" }],
        }),
        deleteTeamMember: builder.mutation<void, TeamRow>({
            async queryFn(member) {
                try {
                    if (member.source === "teacher") {
                        await apiClient.delete(API.INTERNAL.TEACHERS.BY_ID(member.id));
                    } else {
                        await apiClient.delete(API.INTERNAL.TEAMS.BY_ID(member.id));
                    }
                    return { data: undefined };
                } catch (error: any) {
                    return { error: { status: error?.response?.status, data: error?.response?.data ?? error?.message } };
                }
            },
            invalidatesTags: [{ type: "Team", id: "LIST" }, { type: "Teachers", id: "LIST" }],
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useSaveCourseMutation,
    useDeleteCourseMutation,
    useGetTeachersQuery,
    useSaveTeacherMutation,
    useDeleteTeacherMutation,
    useGetStudentsDashboardQuery,
    useSaveStudentMutation,
    useDeleteStudentMutation,
    useGetStudentAssignmentsQuery,
    useAssignStudentCourseMutation,
    useUpdateStudentPortalCredentialsMutation,
    useUploadStudentsCsvMutation,
    useGetBatchesDashboardQuery,
    useSaveBatchMutation,
    useDeleteBatchMutation,
    useGetBatchDetailsQuery,
    useAddBatchNoteMutation,
    useAddBatchAttendanceMutation,
    useGetFeesDashboardQuery,
    useSaveFeePlanMutation,
    useDeleteFeePlanMutation,
    useGetFeePlanPaymentsQuery,
    useAddFeePlanPaymentMutation,
    useGetPaymentsQuery,
    useGetDefaultersQuery,
    useGetLeadsQuery,
    useUpdateLeadMutation,
    useGetLeadTimelineQuery,
    useDownloadLeadImportTemplateMutation,
    usePreviewLeadImportMutation,
    useConfirmLeadImportMutation,
    useGetTeamDataQuery,
    useSaveTeamMemberMutation,
    useDeleteTeamMemberMutation,
} = dashboardTablesApi;
