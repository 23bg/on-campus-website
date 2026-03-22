import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGlobalSearchResults } from "@/features/globalSearch/globalSearchApi";
import type { GlobalSearchState } from "@/features/globalSearch/types";

const initialState: GlobalSearchState = {
    data: { leads: [], students: [], courses: [] },
    loading: false,
    error: null,
};

const getErrorMessage = (error: unknown) =>
    (error as { message?: string })?.message || "Request failed";

export const fetchGlobalSearch = createAsyncThunk("globalSearch/fetchGlobalSearch", async (query: string) => {
    return await getGlobalSearchResults(query);
});

const globalSearchSlice = createSlice({
    name: "globalSearch",
    initialState,
    reducers: {
        clearSearch(state) {
            state.data = { leads: [], students: [], courses: [] };
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalSearch.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGlobalSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchGlobalSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = getErrorMessage(action.error);
                state.data = { leads: [], students: [], courses: [] };
            });
    },
});

export const { clearSearch } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
