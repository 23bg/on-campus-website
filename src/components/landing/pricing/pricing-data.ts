import { PLAN_CONFIG, type PlanType } from "@/config/plans";

export type FeatureId =
    | "publicInstitutePage"
    | "freeOnCampusPage"
    | "captureEnquiries"
    | "enquiryTrackingFollowUps"
    | "studentCourseManagement"
    | "excelImport"
    | "razorpayPayments"
    | "userAccounts"
    | "separateTeamAccounts"
    | "assignEnquiries"
    | "trackOwnership"
    | "whatsAppAlerts"
    | "whatsAppBusinessNumberIntegration"
    | "customDomain"
    | "removeOnCampusBranding"
    | "whiteLabelSystem"
    | "highVolumeSupport";

export type FeatureDefinition = {
    id: FeatureId;
    label: string;
};

export type FeatureGroupDefinition = {
    id: string;
    title: string;
    features: FeatureDefinition[];
};

export const featureGroups: FeatureGroupDefinition[] = [
    {
        id: "coreSystem",
        title: "Core System",
        features: [
            { id: "publicInstitutePage", label: "Public institute page" },
            { id: "freeOnCampusPage", label: "Free OnCampus page" },
            { id: "captureEnquiries", label: "Capture enquiries (QR, links, website)" },
            { id: "enquiryTrackingFollowUps", label: "Enquiry tracking & follow-ups" },
            { id: "studentCourseManagement", label: "Student & course management" },
            { id: "excelImport", label: "Excel import" },
            { id: "razorpayPayments", label: "Razorpay payments" },
        ],
    },
    {
        id: "team",
        title: "Team",
        features: [
            { id: "userAccounts", label: "User accounts" },
            { id: "separateTeamAccounts", label: "Separate team accounts" },
            { id: "assignEnquiries", label: "Assign enquiries" },
            { id: "trackOwnership", label: "Track ownership" },
        ],
    },
    {
        id: "communication",
        title: "Communication",
        features: [
            { id: "whatsAppAlerts", label: "WhatsApp alerts" },
            {
                id: "whatsAppBusinessNumberIntegration",
                label: "WhatsApp Business number integration",
            },
        ],
    },
    {
        id: "branding",
        title: "Branding",
        features: [
            { id: "customDomain", label: "Custom domain" },
            { id: "removeOnCampusBranding", label: "Remove OnCampus branding" },
            { id: "whiteLabelSystem", label: "White-label system" },
            { id: "highVolumeSupport", label: "High-volume support" },
        ],
    },
];

export type PlanDefinition = {
    key: PlanType;
    name: string;
    description: string;
    cta: string;
    link: string;
    highlight?: boolean;
};

export const planDefinitions: PlanDefinition[] = [
    {
        key: "FREE",
        name: "Free",
        description: "Get started with up to 3 jobs and 1 user at no cost.",
        cta: "Start Free",
        link: "/signup",
    },
    {
        key: "BASIC",
        name: "Basic",
        description: "Perfect for small teams with up to 10 jobs and 3 users.",
        cta: "Start Basic",
        link: "/signup",
        highlight: true,
    },
    {
        key: "PRO",
        name: "Pro",
        description: "Built for scaling teams with unlimited jobs and up to 10 users.",
        cta: "Start Pro",
        link: "/signup",
    },
];

export type PlanFeatureAvailability = {
    included: boolean;
    value?: string;
};

export const planFeatureMatrix: Record<PlanType, Record<FeatureId, PlanFeatureAvailability>> = {
    FREE: {
        publicInstitutePage: { included: false },
        freeOnCampusPage: { included: true },
        captureEnquiries: { included: true },
        enquiryTrackingFollowUps: { included: true },
        studentCourseManagement: { included: false },
        excelImport: { included: true },
        razorpayPayments: { included: true },
        userAccounts: { included: true, value: "1 user" },
        separateTeamAccounts: { included: false },
        assignEnquiries: { included: false },
        trackOwnership: { included: false },
        whatsAppAlerts: { included: true },
        whatsAppBusinessNumberIntegration: { included: true },
        customDomain: { included: false },
        removeOnCampusBranding: { included: false },
        whiteLabelSystem: { included: false },
        highVolumeSupport: { included: false },
    },
    BASIC: {
        publicInstitutePage: { included: false },
        freeOnCampusPage: { included: true },
        captureEnquiries: { included: true },
        enquiryTrackingFollowUps: { included: true },
        studentCourseManagement: { included: false },
        excelImport: { included: true },
        razorpayPayments: { included: true },
        userAccounts: { included: true, value: "Up to 3 users" },
        separateTeamAccounts: { included: true },
        assignEnquiries: { included: true },
        trackOwnership: { included: true },
        whatsAppAlerts: { included: true },
        whatsAppBusinessNumberIntegration: { included: true },
        customDomain: { included: false },
        removeOnCampusBranding: { included: false },
        whiteLabelSystem: { included: false },
        highVolumeSupport: { included: false },
    },
    PRO: {
        publicInstitutePage: { included: false },
        freeOnCampusPage: { included: false },
        captureEnquiries: { included: true },
        enquiryTrackingFollowUps: { included: true },
        studentCourseManagement: { included: false },
        excelImport: { included: true },
        razorpayPayments: { included: true },
        userAccounts: { included: true, value: "Up to 10 users" },
        separateTeamAccounts: { included: true },
        assignEnquiries: { included: true },
        trackOwnership: { included: true },
        whatsAppAlerts: { included: true },
        whatsAppBusinessNumberIntegration: { included: true },
        customDomain: { included: true },
        removeOnCampusBranding: { included: true },
        whiteLabelSystem: { included: false },
        highVolumeSupport: { included: true },
    },
};

export const formatPlanPrice = (planType: PlanType, yearlyBilling: boolean) => {
    const amount = yearlyBilling ? PLAN_CONFIG[planType].priceYearly : PLAN_CONFIG[planType].priceMonthly;
    return amount.toLocaleString("en-IN");
};
