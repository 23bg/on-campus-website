import type { BillingInterval } from "@/features/subscription/services/subscription.service";
import { API } from "@/constants/api";
import { baseApi } from "@/services/api";

export type NotificationPreferences = {
    newEnquiryAlert: boolean;
    followUpReminder: boolean;
    leadAssigned: boolean;
    paymentReceived: boolean;
    admissionConfirmed: boolean;
};

export type WhatsAppIntegrationState = {
    mode: "ONCAMPUS_SHARED" | "INSTITUTE_CUSTOM";
    connectedNumber: string | null;
    status: "PENDING" | "VERIFIED" | "ACTIVE" | "DISCONNECTED" | "FAILED";
    phoneNumberId: string | null;
    businessAccountId: string | null;
    connectedAt: string | null;
};

export type InstituteProfile = {
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
    heroImage?: string;
    banner?: string;
    googleMapLink?: string;
    website: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
};

export type OverviewMetrics = {
    leadsThisMonth: number;
    admissionsThisMonth: number;
    totalStudents: number;
    conversionPercentage: number;
    totalFeesCollectedThisMonth: number;
    totalOutstandingFees: number;
    todayOverview?: {
        newLeads: number;
        feesCollected: number;
        feesDueToday: number;
        newStudents: number;
    };
    recentLeads?: Array<{
        id: string;
        name: string;
        phone: string;
        status: string;
        createdAt: string;
    }>;
    recentPayments?: Array<{
        id: string;
        amount: number;
        method?: string | null;
        paidOn: string;
        student: {
            name: string;
            phone: string;
        };
    }>;
    followUpOverview?: {
        todayCount: number;
        overdueCount: number;
        todaysFollowUps: Array<{
            id: string;
            name: string;
            phone: string;
            followUpAt?: string | null;
            status: string;
        }>;
        overdueFollowUps: Array<{
            id: string;
            name: string;
            phone: string;
            followUpAt?: string | null;
            status: string;
        }>;
    };
};

export type OverviewDefaulter = {
    studentId: string;
    studentName: string;
    phone: string;
    courseName: string;
    totalFees: number;
    totalPaid: number;
    pending: number;
    dueDate?: string | null;
};

export type DashboardOverviewResponse = {
    metrics: OverviewMetrics;
    defaulters: OverviewDefaulter[];
};

export type BillingSummary = {
    planType: string;
    planName?: string;
    planAmount: number;
    planAmountYearly?: number;
    pricingVersion?: string;
    currency: string;
    userLimit: number | null;
    usersUsed: number;
    status: string;
    billingInterval?: BillingInterval;
    autopayEnabled?: boolean;
    paymentMethodAddedAt?: string | null;
    trialDaysRemaining?: number | null;
    trialPaymentReminder?: boolean;
    nextBillingDate?: string | null;
    razorpaySubId?: string | null;
    lastPaymentAmount?: number | null;
    lastPaymentDate?: string | null;
};

export type UsageSummary = {
    planType: string;
    alertsUsed: number;
    alertsIncluded: number;
    extraAlerts: number;
    extraAlertRate: number;
    estimatedUsageCost: number;
};

export type InvoiceHistoryItem = {
    id: string;
    month: number;
    year: number;
    periodStart: string;
    periodEnd: string;
    planCharge: number;
    usageCharge: number;
    totalAmount: number;
    status: "PENDING" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";
    dueDate?: string | null;
    issuedAt?: string | null;
    paidAt?: string | null;
    paymentLinkUrl?: string | null;
    downloadUrl?: string | null;
};

export type BillingDashboardPayload = {
    summary: BillingSummary;
    usage: UsageSummary;
    policy: {
        hasOverdue: boolean;
        alertsEnabled: boolean;
        accessRestricted: boolean;
        hasExhaustedPendingInvoice?: boolean;
        notifyPaymentMethodUpdate?: boolean;
    };
    sender?: {
        mode: "ONCAMPUS_SHARED" | "INSTITUTE_CUSTOM";
        connectedNumber?: string | null;
        status?: string;
    };
    invoices: InvoiceHistoryItem[];
};

export type IntegrationItem = {
    id: string;
    provider: "WHATSAPP" | "EMAIL" | "RAZORPAY";
    status: "CONNECTED" | "DISCONNECTED" | "DEGRADED";
    config?: Record<string, unknown> | null;
    updatedAt: string;
};

const DEFAULT_PREFS: NotificationPreferences = {
    newEnquiryAlert: true,
    followUpReminder: true,
    leadAssigned: true,
    paymentReceived: true,
    admissionConfirmed: true,
};

const DEFAULT_WHATSAPP: WhatsAppIntegrationState = {
    mode: "ONCAMPUS_SHARED",
    connectedNumber: null,
    status: "DISCONNECTED",
    phoneNumberId: null,
    businessAccountId: null,
    connectedAt: null,
};

export const adminDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOverview: builder.query<DashboardOverviewResponse | null, void>({
            query: () => ({ url: API.INTERNAL.DASHBOARD.OVERVIEW }),
            providesTags: [{ type: "Overview", id: "SINGLE" }],
        }),
        postAnnouncement: builder.mutation<void, { title: string; body: string }>({
            query: (body) => ({ url: API.INTERNAL.ANNOUNCEMENTS.ROOT, method: "post", data: body }),
            invalidatesTags: [{ type: "Overview", id: "SINGLE" }],
        }),
        getInstituteProfile: builder.query<InstituteProfile, void>({
            query: () => ({ url: API.INTERNAL.INSTITUTE.ROOT }),
            transformResponse: (data: any) => ({
                name: data?.name ?? "",
                slug: data?.slug ?? "",
                description: data?.description ?? "",
                phone: data?.phone ?? "",
                whatsapp: data?.whatsapp ?? "",
                addressLine1: data?.address?.addressLine1 ?? "",
                addressLine2: data?.address?.addressLine2 ?? "",
                city: data?.address?.city ?? "",
                state: data?.address?.state ?? "",
                region: data?.address?.region ?? "",
                postalCode: data?.address?.postalCode ?? "",
                country: data?.address?.country ?? "India",
                countryCode: data?.address?.countryCode ?? "",
                timings: data?.timings ?? "",
                logo: data?.logo ?? "",
                heroImage: data?.heroImage ?? data?.banner ?? "",
                banner: data?.banner ?? "",
                googleMapLink: data?.googleMapLink ?? "",
                website: data?.socialLinks?.website ?? "",
                instagram: data?.socialLinks?.instagram ?? "",
                facebook: data?.socialLinks?.facebook ?? "",
                youtube: data?.socialLinks?.youtube ?? "",
                linkedin: data?.socialLinks?.linkedin ?? "",
            }),
            providesTags: [{ type: "Profile", id: "SINGLE" }],
        }),
        saveInstituteProfile: builder.mutation<InstituteProfile, InstituteProfile>({
            query: (form) => ({
                url: API.INTERNAL.INSTITUTE.ROOT,
                method: "put",
                data: {
                    ...form,
                    address: {
                        addressLine1: form.addressLine1,
                        addressLine2: form.addressLine2,
                        city: form.city,
                        state: form.state,
                        region: form.region,
                        postalCode: form.postalCode,
                        country: form.country,
                        countryCode: form.countryCode,
                    },
                    banner: form.heroImage ?? form.banner ?? "",
                    socialLinks: {
                        website: form.website,
                        instagram: form.instagram,
                        facebook: form.facebook,
                        youtube: form.youtube,
                        linkedin: form.linkedin,
                    },
                },
            }),
            invalidatesTags: [{ type: "Profile", id: "SINGLE" }],
        }),
        getNotificationSettings: builder.query<NotificationPreferences, void>({
            query: () => ({ url: API.INTERNAL.INSTITUTE.NOTIFICATIONS }),
            transformResponse: (data: NotificationPreferences | null | undefined) => ({ ...DEFAULT_PREFS, ...(data ?? {}) }),
            providesTags: [{ type: "Notifications", id: "SINGLE" }],
        }),
        updateNotificationSetting: builder.mutation<{ key: keyof NotificationPreferences; value: boolean }, { key: keyof NotificationPreferences; value: boolean }>({
            query: ({ key, value }) => ({ url: API.INTERNAL.INSTITUTE.NOTIFICATIONS, method: "put", data: { [key]: value } }),
            invalidatesTags: [{ type: "Notifications", id: "SINGLE" }],
        }),
        getWhatsappIntegration: builder.query<WhatsAppIntegrationState, void>({
            query: () => ({ url: API.INTERNAL.INSTITUTE.WHATSAPP }),
            transformResponse: (data: WhatsAppIntegrationState | null | undefined) => data ?? DEFAULT_WHATSAPP,
            providesTags: [{ type: "Whatsapp", id: "SINGLE" }, { type: "Billing", id: "SINGLE" }, { type: "Integrations", id: "LIST" }],
        }),
        connectWhatsapp: builder.mutation<{ data: WhatsAppIntegrationState; otpHint?: string }, string>({
            async queryFn(phoneNumber, _api, _extraOptions, baseQuery) {
                const connectResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP, method: "post", data: { action: "connect", phoneNumber } });
                if (connectResult.error) {
                    return { error: connectResult.error };
                }

                const stateResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP });
                if (stateResult.error) {
                    return { error: stateResult.error };
                }

                return {
                    data: {
                        data: (stateResult.data as WhatsAppIntegrationState | null | undefined) ?? DEFAULT_WHATSAPP,
                        otpHint: (connectResult.data as { otpHint?: string } | null | undefined)?.otpHint,
                    },
                };
            },
            invalidatesTags: [{ type: "Whatsapp", id: "SINGLE" }, { type: "Integrations", id: "LIST" }],
        }),
        verifyWhatsapp: builder.mutation<WhatsAppIntegrationState, string>({
            async queryFn(otp, _api, _extraOptions, baseQuery) {
                const verifyResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP, method: "post", data: { action: "verify", otp } });
                if (verifyResult.error) {
                    return { error: verifyResult.error };
                }

                const stateResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP });
                if (stateResult.error) {
                    return { error: stateResult.error };
                }

                return { data: (stateResult.data as WhatsAppIntegrationState | null | undefined) ?? DEFAULT_WHATSAPP };
            },
            invalidatesTags: [{ type: "Whatsapp", id: "SINGLE" }, { type: "Billing", id: "SINGLE" }, { type: "Integrations", id: "LIST" }],
        }),
        activateWhatsapp: builder.mutation<WhatsAppIntegrationState, { phoneNumberId: string; businessAccountId: string }>({
            async queryFn(payload, _api, _extraOptions, baseQuery) {
                const activateResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP, method: "post", data: { action: "activate", ...payload } });
                if (activateResult.error) {
                    return { error: activateResult.error };
                }

                const stateResult = await baseQuery({ url: API.INTERNAL.INSTITUTE.WHATSAPP });
                if (stateResult.error) {
                    return { error: stateResult.error };
                }

                return { data: (stateResult.data as WhatsAppIntegrationState | null | undefined) ?? DEFAULT_WHATSAPP };
            },
            invalidatesTags: [{ type: "Whatsapp", id: "SINGLE" }, { type: "Billing", id: "SINGLE" }, { type: "Integrations", id: "LIST" }],
        }),
        getBillingDashboard: builder.query<BillingDashboardPayload | null, void>({
            query: () => ({ url: API.INTERNAL.BILLING.ROOT }),
            providesTags: [{ type: "Billing", id: "SINGLE" }],
        }),
        createBillingSubscription: builder.mutation<{ subscriptionId?: string; key?: string }, { planType: string; interval: string }>({
            query: ({ planType, interval }) => ({
                url: API.INTERNAL.BILLING.ROOT,
                method: "post",
                data: { action: "create-subscription", planType, interval },
            }),
        }),
        confirmBillingSubscription: builder.mutation<void, Record<string, unknown>>({
            query: (payload) => ({ url: API.INTERNAL.BILLING.CONFIRM, method: "post", data: payload }),
            invalidatesTags: [{ type: "Billing", id: "SINGLE" }],
        }),
        generateBillingInvoice: builder.mutation<void, void>({
            query: () => ({ url: API.INTERNAL.BILLING.ROOT, method: "post", data: { action: "generate-invoice" } }),
            invalidatesTags: [{ type: "Billing", id: "SINGLE" }],
        }),
        retryBillingInvoice: builder.mutation<string, string>({
            query: (invoiceId) => ({ url: API.INTERNAL.BILLING.ROOT, method: "post", data: { action: "retry-invoice", invoiceId } }),
            invalidatesTags: [{ type: "Billing", id: "SINGLE" }],
        }),
        getIntegrations: builder.query<IntegrationItem[], void>({
            query: () => ({ url: API.INTERNAL.INTEGRATIONS.ROOT }),
            providesTags: [{ type: "Integrations", id: "LIST" }],
        }),
    }),
});

export const {
    useGetOverviewQuery,
    usePostAnnouncementMutation,
    useGetInstituteProfileQuery,
    useSaveInstituteProfileMutation,
    useGetNotificationSettingsQuery,
    useUpdateNotificationSettingMutation,
    useGetWhatsappIntegrationQuery,
    useConnectWhatsappMutation,
    useVerifyWhatsappMutation,
    useActivateWhatsappMutation,
    useGetBillingDashboardQuery,
    useCreateBillingSubscriptionMutation,
    useConfirmBillingSubscriptionMutation,
    useGenerateBillingInvoiceMutation,
    useRetryBillingInvoiceMutation,
    useGetIntegrationsQuery,
} = adminDashboardApi;
