import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from '@/types/api';
import { API } from '@/constants';

export interface SessionData {
    user: {
        id: string;
        email: string;
        role: 'OWNER' | 'MANAGER' | 'VIEWER';
        emailVerified: boolean;
    };
    business: {
        exists: boolean;
        status?: 'DRAFT' | 'ACTIVE';
    };
    gbp: {
        status: 'NOT_CONNECTED' | 'CONNECTED' | 'ERROR';
    };
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: 'include'
    }),
    tagTypes: ['Session'],
    endpoints: (builder) => ({
        getSession: builder.query<SessionData, void>({
            query: () => API.ONCAMPUS.AUTH.ME,
            providesTags: ['Session'],
        }),
    }),
});

export const { useGetSessionQuery } = authApi;
