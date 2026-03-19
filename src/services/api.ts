import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import apiClient from "@/lib/axios";

type AxiosBaseQueryArgs = {
    url: string;
    method?: "get" | "post" | "put" | "patch" | "delete";
    data?: unknown;
    params?: Record<string, unknown> | URLSearchParams;
    responseType?: "json" | "blob";
};

type AxiosBaseQueryError = {
    status?: number;
    data?: unknown;
};

const axiosBaseQuery = (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> => {
    return async ({ url, method = "get", data, params, responseType = "json" }) => {
        try {
            const result = await apiClient.request({
                url,
                method,
                data,
                params,
                responseType,
            });

            if (responseType === "blob") {
                return { data: result.data };
            }

            return { data: result.data?.data ?? result.data };
        } catch (error: any) {
            return {
                error: {
                    status: error?.response?.status,
                    data: error?.response?.data ?? error?.message,
                },
            };
        }
    };
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery(),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    tagTypes: [
        "Courses",
        "Teachers",
        "Students",
        "StudentAssignments",
        "Batches",
        "BatchDetails",
        "Fees",
        "FeePayments",
        "Payments",
        "Defaulters",
        "Leads",
        "LeadTimeline",
        "Team",
        "Overview",
        "Profile",
        "Notifications",
        "Whatsapp",
        "Billing",
        "Integrations",
    ],
    endpoints: () => ({}),
});
