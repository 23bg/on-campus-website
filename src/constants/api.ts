export const API = {
    BASE_V1: '/api/v1',
    ONCAMPUS: {
        AUTH: {
            REQUEST_OTP: '/auth/request-otp',
            VERIFY_OTP: '/auth/verify-otp',
            LOG_OUT: '/auth/logout',
            ME: '/auth/me',
            REFRESH_TOKEN: '/auth/refresh-token',
        },
        DASHBOARD: {
            METRICS: '/dashboard/metrics',
        },
        PUBLIC: {
            LEAD: (slug: string) => `/public/${slug}/lead`,
        },
        WEBHOOKS: {
            RAZORPAY: '/webhooks/razorpay',
        },
    },
    AUTH: {
        LOG_IN: '/auth/request-otp',
        LOG_OUT: '/auth/logout',
        SIGN_UP: '/auth/request-otp',
        VERIFY: '/auth/verify-otp',
        REFRESH_TOKEN: '/auth/refresh-token',
        ME: '/auth/me',
    },
    INTERNAL: {

        AUTH: {
            ME: '/auth/me',
        },
        DASHBOARD: {
            METRICS: '/dashboard/metrics',
            DEFAULTERS: '/dashboard/defaulters',
        },
        INSTITUTE: {
            ROOT: '/institute',
            ONBOARDING: '/institute/onboarding',
        },
        PUBLIC: {
            LEAD: (slug: string) => `/public/${slug}/lead`,
        },
        STUDENT_AUTH: {
            LOGIN: '/student-auth/login',
            LOGOUT: '/student-auth/logout',
        },
        STUDENT_PORTAL: {
            ME: '/student-portal/me',
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
        LEADS: {
            ROOT: '/leads',
            BY_ID: (id: string) => `/leads/${id}`,
            TIMELINE: (id: string) => `/leads/${id}/timeline`,
        },
        SEARCH: '/search',
    },
}
