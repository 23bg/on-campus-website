import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { apiGet, apiPatch, apiPost } from "@/lib/apiService";

type RequestState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};

type MutationState = {
    loading: boolean;
    error: string | null;
};

type Candidate = {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    jobId?: string | null; // Changed from course to jobId
    source?: string | null;
    status: string; // Will be CandidateStatus enum
    message?: string | null;
    followUpAt?: string | null;
    createdAt: string;
};

type CandidateActivity = {
    activityType: string;
    title: string;
    description?: string;
    createdAt: string;
};

type CandidateImportSummary = {
    totalRows: number;
    validRows: number;
    failedRows: number;
    duplicateRows: number;
    imported: number;
    errors: Array<{ row: number; message: string }>;
    duplicates: Array<{ row: number; phone: string }>;
    preview: Array<{
        name: string;
        email?: string;
        phone: string;
        jobId?: string; // Changed from course to jobId
        source?: string;
        city?: string;
    }>;
};

type CandidateState = {
    candidates: RequestState<Candidate[]> & {
        mutation: MutationState;
        timeline: RequestState<CandidateActivity[]>;
        import: { loading: boolean; error: string | null; summary: CandidateImportSummary | null };
    };
};

const initialState: CandidateState = {
    candidates: {
        data: [],
        loading: false,
        error: null,
        mutation: { loading: false, error: null },
        timeline: { data: [], loading: false, error: null },
        import: { loading: false, error: null, summary: null },
    },
};

const getErrorMessage = (error: unknown) =>
    (error as { message?: string })?.message || "Request failed";

export const fetchCandidates = createAsyncThunk("candidate/fetchCandidates", async (queryString: string) =>
    await apiGet<Candidate[]>(`${API.INTERNAL.CANDIDATES.ROOT}${queryString ? `?${queryString}` : ""}`)
);

export const updateCandidateStatus = createAsyncThunk(
    "candidate/updateCandidateStatus",
    async ({ candidateId, nextStatus }: { candidateId: string; nextStatus: string }) => {
        await apiPatch(API.INTERNAL.CANDIDATES.BY_ID(candidateId), { status: nextStatus });
        return { candidateId, nextStatus };
    }
);

export const fetchCandidateTimeline = createAsyncThunk("candidate/fetchCandidateTimeline", async (candidateId: string) =>
    await apiGet<CandidateActivity[]>(API.INTERNAL.CANDIDATES.TIMELINE(candidateId))
);

export const saveCandidateDetails = createAsyncThunk(
    "candidate/saveCandidateDetails",
    async ({ candidateId, message, followUpAt }: { candidateId: string; message: string | null; followUpAt: string | null }) => {
        await apiPatch(API.INTERNAL.CANDIDATES.BY_ID(candidateId), { message, followUpAt });
        return true;
    }
);

export const downloadCandidateImportTemplate = createAsyncThunk("candidate/downloadCandidateImportTemplate", async (format: "csv" | "xlsx" | "json") => {
    const response = await api.get(`${API.INTERNAL.CANDIDATES.IMPORT}?format=${format}`, { responseType: "blob" });
    return { format, blob: response.data as Blob };
});

export const previewCandidateImport = createAsyncThunk("candidate/previewCandidateImport", async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dryRun", "true");
    const response = await api.post(API.INTERNAL.CANDIDATES.IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data as CandidateImportSummary;
});

export const confirmCandidateImport = createAsyncThunk("candidate/confirmCandidateImport", async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dryRun", "false");
    const response = await api.post(API.INTERNAL.CANDIDATES.IMPORT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data as CandidateImportSummary;
});

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        clearCandidateImportSummary(state) {
            state.candidates.import.summary = null;
            state.candidates.import.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidates.pending, (state) => {
                state.candidates.loading = true;
                state.candidates.error = null;
            })
            .addCase(fetchCandidates.fulfilled, (state, action) => {
                state.candidates.loading = false;
                state.candidates.data = action.payload ?? [];
            })
            .addCase(fetchCandidates.rejected, (state, action) => {
                state.candidates.loading = false;
                state.candidates.error = getErrorMessage(action.error);
            })
            .addCase(updateCandidateStatus.pending, (state) => {
                state.candidates.mutation.loading = true;
                state.candidates.mutation.error = null;
            })
            .addCase(updateCandidateStatus.fulfilled, (state, action) => {
                state.candidates.mutation.loading = false;
                state.candidates.data = state.candidates.data.map((candidate) =>
                    candidate.id === action.payload.candidateId ? { ...candidate, status: action.payload.nextStatus } : candidate
                );
            })
            .addCase(updateCandidateStatus.rejected, (state, action) => {
                state.candidates.mutation.loading = false;
                state.candidates.mutation.error = getErrorMessage(action.error);
            })
            .addCase(fetchCandidateTimeline.pending, (state) => {
                state.candidates.timeline.loading = true;
                state.candidates.timeline.error = null;
            })
            .addCase(fetchCandidateTimeline.fulfilled, (state, action) => {
                state.candidates.timeline.loading = false;
                state.candidates.timeline.data = action.payload ?? [];
            })
            .addCase(fetchCandidateTimeline.rejected, (state, action) => {
                state.candidates.timeline.loading = false;
                state.candidates.timeline.error = getErrorMessage(action.error);
            })
            .addCase(saveCandidateDetails.pending, (state) => {
                state.candidates.mutation.loading = true;
            })
            .addCase(saveCandidateDetails.fulfilled, (state) => {
                state.candidates.mutation.loading = false;
            })
            .addCase(saveCandidateDetails.rejected, (state, action) => {
                state.candidates.mutation.loading = false;
                state.candidates.mutation.error = getErrorMessage(action.error);
            })
            .addCase(previewCandidateImport.pending, (state) => {
                state.candidates.import.loading = true;
                state.candidates.import.error = null;
            })
            .addCase(previewCandidateImport.fulfilled, (state, action) => {
                state.candidates.import.loading = false;
                state.candidates.import.summary = action.payload;
            })
            .addCase(previewCandidateImport.rejected, (state, action) => {
                state.candidates.import.loading = false;
                state.candidates.import.error = getErrorMessage(action.error);
            })
            .addCase(confirmCandidateImport.pending, (state) => {
                state.candidates.import.loading = true;
                state.candidates.import.error = null;
            })
            .addCase(confirmCandidateImport.fulfilled, (state, action) => {
                state.candidates.import.loading = false;
                state.candidates.import.summary = action.payload;
            })
            .addCase(confirmCandidateImport.rejected, (state, action) => {
                state.candidates.import.loading = false;
                state.candidates.import.error = getErrorMessage(action.error);
            });
    },
});

export const { clearCandidateImportSummary } = candidateSlice.actions;
export default candidateSlice.reducer;