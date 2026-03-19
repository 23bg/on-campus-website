import { API } from "@/constants/api";
import { baseApi } from "@/services/api";

export type SearchResults = {
    leads: Array<{ id: string; name: string; phone: string; course?: string | null; status: string }>;
    students: Array<{ id: string; name: string; phone: string; email?: string | null }>;
    courses: Array<{ id: string; name: string; duration?: string | null }>;
};

export type PortalData = {
    student?: {
        name?: string;
        admissionDate?: string;
        email?: string | null;
        phone?: string | null;
        institute?: {
            name?: string | null;
            logo?: string | null;
            logoUrl?: string | null;
            description?: string | null;
            address?: string | null;
            phone?: string | null;
            email?: string | null;
            website?: string | null;
            whatsapp?: string | null;
            supportPhone?: string | null;
            supportEmail?: string | null;
            officeAddress?: string | null;
            services?: string[] | null;
            teachers?: Teacher[] | null;
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
    announcements?: Array<{ title: string; body: string; createdAt: string; attachmentUrl?: string | null }>;
    teachers?: Teacher[];
};

export type Teacher = {
    photo?: string | null;
    name?: string | null;
    subject?: string | null;
    experience?: string | null;
    bio?: string | null;
};

export type InstituteFormData = {
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

export type InstituteSummary = {
    form: InstituteFormData;
    studentsCount: number;
    coursesCount: number;
};

export type DomainStatus = "PENDING" | "VERIFIED" | "ACTIVE" | "FAILED";

export type DomainSettings = {
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

export type DataCounts = {
    students: number;
    leads: number;
    courses: number;
    payments: number;
};

export type OnboardingPayload = Record<string, unknown>;

export const appUiApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStudentPortal: builder.query<PortalData | null, void>({
            query: () => ({ url: API.INTERNAL.STUDENT_PORTAL.ME }),
            providesTags: [{ type: "Profile", id: "STUDENT_PORTAL" }],
        }),
        studentPortalLogin: builder.mutation<void, { identifier: string; password: string }>({
            query: (payload) => ({ url: API.INTERNAL.STUDENT_AUTH.LOGIN, method: "post", data: payload }),
            invalidatesTags: [{ type: "Profile", id: "STUDENT_PORTAL" }],
        }),
        studentPortalLogout: builder.mutation<void, void>({
            query: () => ({ url: API.INTERNAL.STUDENT_AUTH.LOGOUT, method: "post", data: {} }),
            invalidatesTags: [{ type: "Profile", id: "STUDENT_PORTAL" }],
        }),
        userLogout: builder.mutation<void, void>({
            query: () => ({ url: API.AUTH.LOG_OUT, method: "post", data: {} }),
        }),
        getInstituteSummary: builder.query<InstituteSummary, void>({
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                const [institute, students, courses] = await Promise.all([
                    baseQuery({ url: API.INTERNAL.INSTITUTE.ROOT }),
                    baseQuery({ url: API.INTERNAL.STUDENTS.ROOT }),
                    baseQuery({ url: API.INTERNAL.COURSES.ROOT }),
                ]);

                if (institute.error) return { error: institute.error };
                if (students.error) return { error: students.error };
                if (courses.error) return { error: courses.error };

                const instituteData = (institute.data ?? {}) as any;
                const studentsData = (students.data ?? []) as any[];
                const coursesData = (courses.data ?? []) as any[];

                return {
                    data: {
                        form: {
                            name: instituteData?.name ?? "",
                            slug: instituteData?.slug ?? "",
                            description: instituteData?.description ?? "",
                            phone: instituteData?.phone ?? "",
                            whatsapp: instituteData?.whatsapp ?? "",
                            addressLine1: instituteData?.address?.addressLine1 ?? "",
                            addressLine2: instituteData?.address?.addressLine2 ?? "",
                            city: instituteData?.address?.city ?? "",
                            state: instituteData?.address?.state ?? "",
                            region: instituteData?.address?.region ?? "",
                            postalCode: instituteData?.address?.postalCode ?? "",
                            country: instituteData?.address?.country ?? "India",
                            countryCode: instituteData?.address?.countryCode ?? "",
                            timings: instituteData?.timings ?? "",
                            logo: instituteData?.logo ?? "",
                            banner: instituteData?.banner ?? "",
                            website: instituteData?.socialLinks?.website ?? "",
                            instagram: instituteData?.socialLinks?.instagram ?? "",
                            facebook: instituteData?.socialLinks?.facebook ?? "",
                            youtube: instituteData?.socialLinks?.youtube ?? "",
                            linkedin: instituteData?.socialLinks?.linkedin ?? "",
                        },
                        studentsCount: studentsData.length,
                        coursesCount: coursesData.length,
                    },
                };
            },
            providesTags: [{ type: "Profile", id: "INSTITUTE_SUMMARY" }],
        }),
        getSettingsCounts: builder.query<DataCounts, void>({
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                const [studentsRes, leadsRes, coursesRes, paymentsRes] = await Promise.all([
                    baseQuery({ url: API.INTERNAL.STUDENTS.ROOT }),
                    baseQuery({ url: API.INTERNAL.LEADS.ROOT }),
                    baseQuery({ url: API.INTERNAL.COURSES.ROOT }),
                    baseQuery({ url: API.INTERNAL.PAYMENTS.ROOT }),
                ]);

                if (studentsRes.error) return { error: studentsRes.error };
                if (leadsRes.error) return { error: leadsRes.error };
                if (coursesRes.error) return { error: coursesRes.error };
                if (paymentsRes.error) return { error: paymentsRes.error };

                return {
                    data: {
                        students: ((studentsRes.data ?? []) as any[]).length,
                        leads: ((leadsRes.data ?? []) as any[]).length,
                        courses: ((coursesRes.data ?? []) as any[]).length,
                        payments: ((paymentsRes.data ?? []) as any[]).length,
                    },
                };
            },
        }),
        exportSettingsData: builder.mutation<Record<string, unknown>, void>({
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                const [students, leads, courses, fees, payments] = await Promise.all([
                    baseQuery({ url: API.INTERNAL.STUDENTS.ROOT }),
                    baseQuery({ url: API.INTERNAL.LEADS.ROOT }),
                    baseQuery({ url: API.INTERNAL.COURSES.ROOT }),
                    baseQuery({ url: API.INTERNAL.FEES.ROOT }),
                    baseQuery({ url: API.INTERNAL.PAYMENTS.ROOT }),
                ]);

                if (students.error) return { error: students.error };
                if (leads.error) return { error: leads.error };
                if (courses.error) return { error: courses.error };
                if (fees.error) return { error: fees.error };
                if (payments.error) return { error: payments.error };

                return {
                    data: {
                        exportedAt: new Date().toISOString(),
                        data: {
                            students: students.data ?? [],
                            leads: leads.data ?? [],
                            courses: courses.data ?? [],
                            fees: fees.data ?? [],
                            payments: payments.data ?? [],
                        },
                    },
                };
            },
        }),
        getDomainSettings: builder.query<DomainSettings | null, void>({
            query: () => ({ url: API.INTERNAL.INSTITUTE.DOMAIN }),
            providesTags: [{ type: "Profile", id: "DOMAIN" }],
        }),
        saveDomainSettings: builder.mutation<DomainSettings | null, { customDomain: string }>({
            query: ({ customDomain }) => ({
                url: API.INTERNAL.INSTITUTE.DOMAIN,
                method: "put",
                data: { customDomain, surface: "portal" },
            }),
            invalidatesTags: [{ type: "Profile", id: "DOMAIN" }],
        }),
        verifyDomainSettings: builder.mutation<DomainSettings | null, { customDomain: string }>({
            async queryFn({ customDomain }, _api, _extraOptions, baseQuery) {
                const verifyResult = await baseQuery({
                    url: API.INTERNAL.INSTITUTE.DOMAIN,
                    method: "post",
                    data: { action: "verify", customDomain },
                });
                if (verifyResult.error) return { error: verifyResult.error };
                const latest = await baseQuery({ url: API.INTERNAL.INSTITUTE.DOMAIN });
                if (latest.error) return { error: latest.error };
                return { data: (latest.data ?? null) as DomainSettings | null };
            },
            invalidatesTags: [{ type: "Profile", id: "DOMAIN" }],
        }),
        activateDomainSettings: builder.mutation<DomainSettings | null, { customDomain: string }>({
            query: ({ customDomain }) => ({
                url: API.INTERNAL.INSTITUTE.DOMAIN,
                method: "post",
                data: { action: "activate", customDomain },
            }),
            invalidatesTags: [{ type: "Profile", id: "DOMAIN" }],
        }),
        submitPublicEnquiry: builder.mutation<void, { slug: string; values: Record<string, unknown> }>({
            query: ({ slug, values }) => ({ url: API.INTERNAL.PUBLIC.LEAD(slug), method: "post", data: values }),
        }),
        getOnboardingInstitute: builder.query<OnboardingPayload, void>({
            query: () => ({ url: API.INTERNAL.INSTITUTE.ROOT }),
        }),
        submitOnboarding: builder.mutation<OnboardingPayload, OnboardingPayload>({
            query: (payload) => ({ url: API.INTERNAL.INSTITUTE.ONBOARDING, method: "post", data: payload }),
        }),
        getGlobalSearch: builder.query<SearchResults, string>({
            query: (query) => ({ url: `${API.INTERNAL.SEARCH}?q=${encodeURIComponent(query.trim())}` }),
        }),
    }),
});

export const {
    useGetStudentPortalQuery,
    useStudentPortalLoginMutation,
    useStudentPortalLogoutMutation,
    useUserLogoutMutation,
    useGetInstituteSummaryQuery,
    useGetSettingsCountsQuery,
    useExportSettingsDataMutation,
    useGetDomainSettingsQuery,
    useSaveDomainSettingsMutation,
    useVerifyDomainSettingsMutation,
    useActivateDomainSettingsMutation,
    useSubmitPublicEnquiryMutation,
    useGetOnboardingInstituteQuery,
    useSubmitOnboardingMutation,
    useLazyGetGlobalSearchQuery,
} = appUiApi;
