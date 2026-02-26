export const API = {
    ONCAMPUS: {
        AUTH: {
            REQUEST_OTP: '/api/auth/request-otp',
            VERIFY_OTP: '/api/auth/verify-otp',
            LOG_OUT: '/api/auth/logout',
            ME: '/api/auth/me',
            REFRESH_TOKEN: '/api/auth/refresh-token',
        },
        DASHBOARD: {
            METRICS: '/api/dashboard/metrics',
        },
        PUBLIC: {
            LEAD: (slug: string) => `/api/public/${slug}/lead`,
        },
        WEBHOOKS: {
            RAZORPAY: '/api/webhooks/razorpay',
        },
    },
    AUTH: {
        LOG_IN: '/api/auth/request-otp',
        LOG_OUT: '/api/auth/logout',
        SIGN_UP: '/api/auth/request-otp',
        VERIFY: '/api/auth/verify-otp',
        REFRESH_TOKEN: '/api/auth/refresh-token',
        ME: '/api/auth/me',
    },
}
