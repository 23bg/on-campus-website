export const API = {
    BASE_V1: '/api/v1',
    ONCAMPUS: {
        AUTH: {
            SIGN_UP: '/auth/signup',
            LOG_IN: '/auth/login',
            VERIFICATION: '/auth/verification',
            VERIFICATION_REQUEST: '/auth/verification/request',
            LOG_OUT: '/auth/logout',
            ME: '/auth/me',
            REFRESH_TOKEN: '/auth/refresh',
            PASSWORD_RESET: '/auth/password-reset',
            PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
        },
        DASHBOARD: {
            METRICS: '/dashboard/metrics',
        },
        PUBLIC: {
            CANDIDATE: (slug: string) => `/public/${slug}/candidate`,
        },
        WEBHOOKS: {
            RAZORPAY: '/webhooks/razorpay',
        },
    },
    AUTH: {
        LOG_IN: '/auth/login',
        LOG_OUT: '/auth/logout',
        SIGN_UP: '/auth/signup',
        VERIFY: '/auth/verification',
        VERIFY_REQUEST: '/auth/verification/request',
        REFRESH_TOKEN: '/auth/refresh',
        PASSWORD_RESET: '/auth/password-reset',
        PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
        ME: '/auth/me',
    },
    INTERNAL: {

        AUTH: {
            ME: '/auth/me',
        },
        DASHBOARD: {
            METRICS: '/dashboard/metrics',
            DEFAULTERS: '/dashboard/defaulters',
            OVERVIEW: '/dashboard/overview',
        },
        INSTITUTE: {
            ROOT: '/institute',
            ONBOARDING: '/institute/onboarding',
            DOMAIN: '/institute/domain',
            WHATSAPP: '/institute/whatsapp',
            NOTIFICATIONS: '/institute/notifications',
        },
        AI: {
            IMRABO_CHAT: '/ai/imrabo',
        },
        PUBLIC: {
            CANDIDATE: (slug: string) => `/public/${slug}/candidate`,
        },
        STUDENT_AUTH: {
            LOGIN: '/student-auth/login',
            LOGOUT: '/student-auth/logout',
        },
        NOTIFICATIONS: {
            ADMIN: '/notifications/admin',
            REMINDERS: '/notifications/reminders',
        },
        INTEGRATIONS: {
            ROOT: '/integrations',
        },
        ANNOUNCEMENTS: {
            ROOT: '/announcements',
        },
        BILLING: {
            ROOT: '/billing',
            CONFIRM: '/billing/confirm',
        },
        TEAMS: {
            ROOT: '/teams',
            BY_ID: (id: string) => `/teams/${id}`,
        },
        TEACHERS: {
            ROOT: '/teachers',
            BY_ID: (id: string) => `/teachers/${id}`,
        },
        STUDENTS: {
            ROOT: '/students',
            BY_ID: (id: string) => `/students/${id}`,
            UPLOAD: '/students/upload',
            COURSES: (id: string) => `/students/${id}/courses`,
            COURSE_ASSIGNMENT: (id: string, assignmentId: string) => `/students/${id}/courses/${assignmentId}`,
        },
        COURSES: {
            ROOT: '/courses',
            BY_ID: (id: string) => `/courses/${id}`,
        },
        BATCHES: {
            ROOT: '/batches',
            BY_ID: (id: string) => `/batches/${id}`,
        },
        FEES: {
            ROOT: '/fees',
            BY_ID: (id: string) => `/fees/${id}`,
            INSTALLMENTS: (id: string) => `/fees/${id}/installments`,
            WITH_STUDENT: (studentId: string) => `/fees?studentId=${studentId}`,
        },
        PAYMENTS: {
            ROOT: '/payments',
        },
        CANDIDATES: { // Renamed from LEADS
            ROOT: '/candidates', // Renamed from /leads
            BY_ID: (id: string) => `/candidates/${id}`, // Renamed from /leads/${id}
            TIMELINE: (id: string) => `/candidates/${id}/timeline`, // Renamed from /leads/${id}/timeline
            IMPORT: '/candidates/import', // Renamed from /leads/import
        },
        NOTES: {
            ROOT: '/notes',
        },
        ATTENDANCE: {
            ROOT: '/attendance',
        },
        SEARCH: '/search',
    },
}
