import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/apiService";
import { API } from "@/constants/api";

type AsyncState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};

type SearchResults = {
    leads: Array<{ id: string; name: string; phone: string; course?: string | null; status: string }>;
    students: Array<{ id: string; name: string; phone: string; email?: string | null }>;
    courses: Array<{ id: string; name: string; duration?: string | null }>;
};

type PortalData = {
    student?: {
        name?: string;
        admissionDate?: string;
        email?: string | null;
        phone?: string | null;
        institute?: {
            name?: string | null;
            logo?: string | null;
            logoUrl?: string | null;
        } | null;
        course?: { name: string; duration?: string | null; description?: string | null } | null;
        batch?: {
            name?: string;
            startDate?: string | null;
            time?: string | null;
            timing?: string | null;
            teacherName?: string | null;
            faculty?: string | null;
            liveClassLink?: string | null;
            recordedLecturesLink?: string | null;
            studyMaterialLink?: string | null;
        } | null;
        totalFees?: number | null;
        paidAmount?: number | null;
        pendingAmount?: number | null;
        nextDueDate?: string | null;
        liveClassLink?: string | null;
        recordedLecturesLink?: string | null;
        studyMaterialLink?: string | null;
    };
    announcements?: Array<{ title: string; body: string; createdAt: string }>;
};

type TeamRow = {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: "OWNER" | "MANAGER" | "COUNSELOR" | "TEACHER" | "VIEWER";
    active: boolean;
    subjects?: string;
    experience?: string;
    bio?: string;
    source: "team" | "teacher";
};

type InstituteFormData = {
    name: string;
    slug: string;
    description: string;
    phone: string;
    whatsapp: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
    timings: string;
    logo: string;
    banner: string;
    website: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
};

type InstituteSummary = {
    form: InstituteFormData;
    studentsCount: number;
    coursesCount: number;
};

type DomainStatus = "PENDING" | "VERIFIED" | "ACTIVE" | "FAILED";

type DomainSettings = {
    slug: string;
    customDomain: string;
    domainVerified: boolean;
    domainStatus: DomainStatus;
    defaultDomain: string;
    dnsInstruction: {
        type: string;
        name: string;
        target: string;
    };
};

type DataCounts = {
    students: number;
    leads: number;
    courses: number;
    payments: number;
};

type TeamState = AsyncState<TeamRow[]> & {
    sessionRole: "OWNER" | "MANAGER" | "VIEWER" | null;
    mutationLoading: boolean;
};

type InstituteState = {
    summary: AsyncState<InstituteSummary | null>;
    domain: AsyncState<DomainSettings | null>;
    counts: AsyncState<DataCounts>;
    exportData: AsyncState<Record<string, unknown> | null>;
    onboarding: {
        loading: boolean;
        error: string | null;
        data: Record<string, unknown> | null;
    };
    publicEnquiry: {
        loading: boolean;
        error: string | null;
    };
};

type PortalState = AsyncState<PortalData | null> & {
    authLoading: boolean;
};

type SearchState = AsyncState<SearchResults>;

type AppState = {
    team: TeamState;
    institute: InstituteState;
    portal: PortalState;
    search: SearchState;
};

const emptyInstituteForm: InstituteFormData = {
    name: "",
    slug: "",
    description: "",
    phone: "",
    whatsapp: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    region: "",
    postalCode: "",
    country: "India",
    countryCode: "",
    timings: "",
    logo: "",
    banner: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
};

const initialState: AppState = {
    team: {
        data: [],
        loading: false,
        error: null,
        sessionRole: null,
        mutationLoading: false,
    },
    institute: {
        summary: { data: null, loading: false, error: null },
        domain: { data: null, loading: false, error: null },
        counts: { data: { students: 0, leads: 0, courses: 0, payments: 0 }, loading: false, error: null },
        exportData: { data: null, loading: false, error: null },
        onboarding: { loading: false, error: null, data: null },
        publicEnquiry: { loading: false, error: null },
    },
    portal: {
        data: null,
        loading: false,
        error: null,
        authLoading: false,
    },
    search: {
        data: { leads: [], students: [], courses: [] },
        loading: false,
        error: null,
    },
};

const getErrorMessage = (error: unknown) =>
    (error as { message?: string })?.message || "Request failed";

export const fetchTeamData = createAsyncThunk("app/fetchTeamData", async () => {
    const [sessionRes, teamsRes, teachersRes] = await Promise.all([
        apiGet<{ user?: { role?: "OWNER" | "MANAGER" | "VIEWER" | null } }>(API.INTERNAL.AUTH.ME),
        apiGet<any[]>(API.INTERNAL.TEAMS.ROOT),
        apiGet<any[]>(API.INTERNAL.TEACHERS.ROOT),
    ]);

    const teamRows: TeamRow[] = (teamsRes ?? []).map((member) => ({
        id: member.id,
        name: member.name ?? member.email ?? "Unknown",
        phone: "",
        email: member.email ?? "",
        role: member.role,
        active: true,
        source: "team",
    }));

    const teacherRows: TeamRow[] = (teachersRes ?? []).map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        phone: "",
        email: "",
        role: "TEACHER",
        active: true,
        subjects: teacher.subject ?? "",
        experience: "",
        bio: teacher.bio ?? "",
        source: "teacher",
    }));

    return {
        rows: [...teamRows, ...teacherRows],
        sessionRole: sessionRes?.user?.role ?? null,
    };
});

export const saveTeamMember = createAsyncThunk(
    "app/saveTeamMember",
    async ({ values, editing }: { values: any; editing: TeamRow | null }) => {
        if (values.role === "TEACHER") {
            const payload = {
                name: values.name,
                subject: values.subjects || undefined,
                bio: values.bio || undefined,
            };

            if (editing?.source === "teacher") {
                await apiPatch(API.INTERNAL.TEACHERS.BY_ID(editing.id), payload);
            } else {
                await apiPost(API.INTERNAL.TEACHERS.ROOT, payload);
            }
        } else {
            const mappedRole = values.role === "VIEWER" ? "VIEWER" : "MANAGER";

            if (editing?.source === "team") {
                await apiPatch(API.INTERNAL.TEAMS.BY_ID(editing.id), { role: mappedRole });
            } else {
                await apiPost(API.INTERNAL.TEAMS.ROOT, {
                    name: values.name,
                    email: values.email,
                    role: mappedRole,
                });
            }
        }
        return true;
    }
);

export const deleteTeamMember = createAsyncThunk("app/deleteTeamMember", async (member: TeamRow) => {
    if (member.source === "teacher") {
        await apiDelete(API.INTERNAL.TEACHERS.BY_ID(member.id));
    } else {
        await apiDelete(API.INTERNAL.TEAMS.BY_ID(member.id));
    }
    return member.id;
});

export const fetchStudentPortal = createAsyncThunk("app/fetchStudentPortal", async () => {
    return await apiGet<PortalData>(API.INTERNAL.STUDENT_PORTAL.ME);
});

export const studentPortalLogin = createAsyncThunk(
    "app/studentPortalLogin",
    async (payload: { identifier: string; password: string }) => {
        await apiPost(API.INTERNAL.STUDENT_AUTH.LOGIN, payload);
        return true;
    }
);

export const studentPortalLogout = createAsyncThunk("app/studentPortalLogout", async () => {
    await apiPost(API.INTERNAL.STUDENT_AUTH.LOGOUT, {});
    return true;
});

export const userLogout = createAsyncThunk("app/userLogout", async () => {
    await apiPost(API.AUTH.LOG_OUT, {});
    return true;
});

export const fetchInstituteSummary = createAsyncThunk("app/fetchInstituteSummary", async () => {
    const [institute, students, courses] = await Promise.all([
        apiGet<any>(API.INTERNAL.INSTITUTE.ROOT),
        apiGet<any[]>(API.INTERNAL.STUDENTS.ROOT),
        apiGet<any[]>(API.INTERNAL.COURSES.ROOT),
    ]);

    return {
        form: {
            name: institute?.name ?? "",
            slug: institute?.slug ?? "",
            description: institute?.description ?? "",
            phone: institute?.phone ?? "",
            whatsapp: institute?.whatsapp ?? "",
            addressLine1: institute?.address?.addressLine1 ?? "",
            addressLine2: institute?.address?.addressLine2 ?? "",
            city: institute?.address?.city ?? "",
            state: institute?.address?.state ?? "",
            region: institute?.address?.region ?? "",
            postalCode: institute?.address?.postalCode ?? "",
            country: institute?.address?.country ?? "India",
            countryCode: institute?.address?.countryCode ?? "",
            timings: institute?.timings ?? "",
            logo: institute?.logo ?? "",
            banner: institute?.banner ?? "",
            website: institute?.socialLinks?.website ?? "",
            instagram: institute?.socialLinks?.instagram ?? "",
            facebook: institute?.socialLinks?.facebook ?? "",
            youtube: institute?.socialLinks?.youtube ?? "",
            linkedin: institute?.socialLinks?.linkedin ?? "",
        },
        studentsCount: (students ?? []).length,
        coursesCount: (courses ?? []).length,
    } satisfies InstituteSummary;
});

export const fetchSettingsCounts = createAsyncThunk("app/fetchSettingsCounts", async () => {
    const [studentsRes, leadsRes, coursesRes, paymentsRes] = await Promise.all([
        apiGet<any[]>(API.INTERNAL.STUDENTS.ROOT),
        apiGet<any[]>(API.INTERNAL.LEADS.ROOT),
        apiGet<any[]>(API.INTERNAL.COURSES.ROOT),
        apiGet<any[]>(API.INTERNAL.PAYMENTS.ROOT),
    ]);

    return {
        students: (studentsRes ?? []).length,
        leads: (leadsRes ?? []).length,
        courses: (coursesRes ?? []).length,
        payments: (paymentsRes ?? []).length,
    };
});

export const exportSettingsData = createAsyncThunk("app/exportSettingsData", async () => {
    const [students, leads, courses, fees, payments] = await Promise.all([
        apiGet<any[]>(API.INTERNAL.STUDENTS.ROOT),
        apiGet<any[]>(API.INTERNAL.LEADS.ROOT),
        apiGet<any[]>(API.INTERNAL.COURSES.ROOT),
        apiGet<any[]>(API.INTERNAL.FEES.ROOT),
        apiGet<any[]>(API.INTERNAL.PAYMENTS.ROOT),
    ]);

    return {
        exportedAt: new Date().toISOString(),
        data: {
            students: students ?? [],
            leads: leads ?? [],
            courses: courses ?? [],
            fees: fees ?? [],
            payments: payments ?? [],
        },
    };
});

export const fetchDomainSettings = createAsyncThunk("app/fetchDomainSettings", async () => {
    return await apiGet<DomainSettings>(API.INTERNAL.INSTITUTE.DOMAIN);
});

export const saveDomainSettings = createAsyncThunk(
    "app/saveDomainSettings",
    async ({ customDomain }: { customDomain: string }) => {
        return await apiPut<DomainSettings>(API.INTERNAL.INSTITUTE.DOMAIN, {
            customDomain,
            surface: "portal",
        });
    }
);

export const verifyDomainSettings = createAsyncThunk(
    "app/verifyDomainSettings",
    async ({ customDomain }: { customDomain: string }) => {
        await apiPost(API.INTERNAL.INSTITUTE.DOMAIN, {
            action: "verify",
            customDomain,
        });
        return await apiGet<DomainSettings>(API.INTERNAL.INSTITUTE.DOMAIN);
    }
);

export const activateDomainSettings = createAsyncThunk(
    "app/activateDomainSettings",
    async ({ customDomain }: { customDomain: string }) => {
        return await apiPost<DomainSettings>(API.INTERNAL.INSTITUTE.DOMAIN, {
            action: "activate",
            customDomain,
        });
    }
);

export const submitPublicEnquiry = createAsyncThunk(
    "app/submitPublicEnquiry",
    async ({ slug, values }: { slug: string; values: Record<string, unknown> }) => {
        await apiPost(API.INTERNAL.PUBLIC.LEAD(slug), values);
        return true;
    }
);

export const fetchOnboardingInstitute = createAsyncThunk("app/fetchOnboardingInstitute", async () => {
    return await apiGet<Record<string, unknown>>(API.INTERNAL.INSTITUTE.ROOT);
});

export const submitOnboarding = createAsyncThunk(
    "app/submitOnboarding",
    async (payload: Record<string, unknown>) => {
        return await apiPost<Record<string, unknown>>(API.INTERNAL.INSTITUTE.ONBOARDING, payload);
    }
);

export const fetchGlobalSearch = createAsyncThunk("app/fetchGlobalSearch", async (query: string) => {
    const response = await api.get(`${API.INTERNAL.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    return (response.data?.data ?? { leads: [], students: [], courses: [] }) as SearchResults;
});

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        clearSearch(state) {
            state.search.data = { leads: [], students: [], courses: [] };
            state.search.loading = false;
            state.search.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamData.pending, (state) => {
                state.team.loading = true;
                state.team.error = null;
            })
            .addCase(fetchTeamData.fulfilled, (state, action) => {
                state.team.loading = false;
                state.team.data = action.payload.rows;
                state.team.sessionRole = action.payload.sessionRole;
            })
            .addCase(fetchTeamData.rejected, (state, action) => {
                state.team.loading = false;
                state.team.error = getErrorMessage(action.error);
            })
            .addCase(saveTeamMember.pending, (state) => {
                state.team.mutationLoading = true;
            })
            .addCase(saveTeamMember.fulfilled, (state) => {
                state.team.mutationLoading = false;
            })
            .addCase(saveTeamMember.rejected, (state, action) => {
                state.team.mutationLoading = false;
                state.team.error = getErrorMessage(action.error);
            })
            .addCase(deleteTeamMember.pending, (state) => {
                state.team.mutationLoading = true;
            })
            .addCase(deleteTeamMember.fulfilled, (state) => {
                state.team.mutationLoading = false;
            })
            .addCase(deleteTeamMember.rejected, (state, action) => {
                state.team.mutationLoading = false;
                state.team.error = getErrorMessage(action.error);
            })
            .addCase(fetchStudentPortal.pending, (state) => {
                state.portal.loading = true;
                state.portal.error = null;
            })
            .addCase(fetchStudentPortal.fulfilled, (state, action) => {
                state.portal.loading = false;
                state.portal.data = action.payload;
            })
            .addCase(fetchStudentPortal.rejected, (state, action) => {
                state.portal.loading = false;
                state.portal.error = getErrorMessage(action.error);
            })
            .addCase(studentPortalLogin.pending, (state) => {
                state.portal.authLoading = true;
                state.portal.error = null;
            })
            .addCase(studentPortalLogin.fulfilled, (state) => {
                state.portal.authLoading = false;
            })
            .addCase(studentPortalLogin.rejected, (state, action) => {
                state.portal.authLoading = false;
                state.portal.error = getErrorMessage(action.error);
            })
            .addCase(studentPortalLogout.pending, (state) => {
                state.portal.authLoading = true;
            })
            .addCase(studentPortalLogout.fulfilled, (state) => {
                state.portal.authLoading = false;
                state.portal.data = null;
            })
            .addCase(studentPortalLogout.rejected, (state) => {
                state.portal.authLoading = false;
                state.portal.data = null;
            })
            .addCase(fetchInstituteSummary.pending, (state) => {
                state.institute.summary.loading = true;
                state.institute.summary.error = null;
            })
            .addCase(fetchInstituteSummary.fulfilled, (state, action) => {
                state.institute.summary.loading = false;
                state.institute.summary.data = action.payload;
            })
            .addCase(fetchInstituteSummary.rejected, (state, action) => {
                state.institute.summary.loading = false;
                state.institute.summary.error = getErrorMessage(action.error);
            })
            .addCase(fetchSettingsCounts.pending, (state) => {
                state.institute.counts.loading = true;
            })
            .addCase(fetchSettingsCounts.fulfilled, (state, action) => {
                state.institute.counts.loading = false;
                state.institute.counts.data = action.payload;
            })
            .addCase(fetchSettingsCounts.rejected, (state, action) => {
                state.institute.counts.loading = false;
                state.institute.counts.error = getErrorMessage(action.error);
            })
            .addCase(exportSettingsData.pending, (state) => {
                state.institute.exportData.loading = true;
            })
            .addCase(exportSettingsData.fulfilled, (state, action) => {
                state.institute.exportData.loading = false;
                state.institute.exportData.data = action.payload;
            })
            .addCase(exportSettingsData.rejected, (state, action) => {
                state.institute.exportData.loading = false;
                state.institute.exportData.error = getErrorMessage(action.error);
            })
            .addCase(fetchDomainSettings.pending, (state) => {
                state.institute.domain.loading = true;
            })
            .addCase(fetchDomainSettings.fulfilled, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.data = action.payload;
            })
            .addCase(fetchDomainSettings.rejected, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.error = getErrorMessage(action.error);
            })
            .addCase(saveDomainSettings.pending, (state) => {
                state.institute.domain.loading = true;
            })
            .addCase(saveDomainSettings.fulfilled, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.data = action.payload;
            })
            .addCase(saveDomainSettings.rejected, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.error = getErrorMessage(action.error);
            })
            .addCase(verifyDomainSettings.pending, (state) => {
                state.institute.domain.loading = true;
            })
            .addCase(verifyDomainSettings.fulfilled, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.data = action.payload;
            })
            .addCase(verifyDomainSettings.rejected, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.error = getErrorMessage(action.error);
            })
            .addCase(activateDomainSettings.pending, (state) => {
                state.institute.domain.loading = true;
            })
            .addCase(activateDomainSettings.fulfilled, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.data = action.payload;
            })
            .addCase(activateDomainSettings.rejected, (state, action) => {
                state.institute.domain.loading = false;
                state.institute.domain.error = getErrorMessage(action.error);
            })
            .addCase(submitPublicEnquiry.pending, (state) => {
                state.institute.publicEnquiry.loading = true;
                state.institute.publicEnquiry.error = null;
            })
            .addCase(submitPublicEnquiry.fulfilled, (state) => {
                state.institute.publicEnquiry.loading = false;
            })
            .addCase(submitPublicEnquiry.rejected, (state, action) => {
                state.institute.publicEnquiry.loading = false;
                state.institute.publicEnquiry.error = getErrorMessage(action.error);
            })
            .addCase(fetchOnboardingInstitute.pending, (state) => {
                state.institute.onboarding.loading = true;
            })
            .addCase(fetchOnboardingInstitute.fulfilled, (state, action) => {
                state.institute.onboarding.loading = false;
                state.institute.onboarding.data = action.payload;
            })
            .addCase(fetchOnboardingInstitute.rejected, (state, action) => {
                state.institute.onboarding.loading = false;
                state.institute.onboarding.error = getErrorMessage(action.error);
            })
            .addCase(submitOnboarding.pending, (state) => {
                state.institute.onboarding.loading = true;
            })
            .addCase(submitOnboarding.fulfilled, (state, action) => {
                state.institute.onboarding.loading = false;
                state.institute.onboarding.data = action.payload;
            })
            .addCase(submitOnboarding.rejected, (state, action) => {
                state.institute.onboarding.loading = false;
                state.institute.onboarding.error = getErrorMessage(action.error);
            })
            .addCase(fetchGlobalSearch.pending, (state) => {
                state.search.loading = true;
            })
            .addCase(fetchGlobalSearch.fulfilled, (state, action) => {
                state.search.loading = false;
                state.search.data = action.payload;
            })
            .addCase(fetchGlobalSearch.rejected, (state, action) => {
                state.search.loading = false;
                state.search.error = getErrorMessage(action.error);
                state.search.data = { leads: [], students: [], courses: [] };
            });
    },
});

export const { clearSearch } = appSlice.actions;
export default appSlice.reducer;
