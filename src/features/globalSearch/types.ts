export type SearchResults = {
    leads: Array<{ id: string; name: string; phone: string; course?: string | null; status: string }>;
    students: Array<{ id: string; name: string; phone: string; email?: string | null }>;
    courses: Array<{ id: string; name: string; duration?: string | null }>;
};

export type GlobalSearchState = {
    data: SearchResults;
    loading: boolean;
    error: string | null;
};
