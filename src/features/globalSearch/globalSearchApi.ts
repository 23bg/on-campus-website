import api from "@/lib/axios";
import { API } from "@/constants/api";
import type { SearchResults } from "@/features/globalSearch/types";

export const getGlobalSearchResults = async (query: string) => {
    const response = await api.get(`${API.INTERNAL.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    return (response.data?.data ?? { leads: [], students: [], courses: [] }) as SearchResults;
};
