import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import courseReducer from "@/features/course/courseSlice";
import appTeamReducer from "@/features/appTeam/appTeamSlice";
import appInstituteReducer from "@/features/appInstitute/appInstituteSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import candidateReducer from "@/features/candidate/candidateSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        course: courseReducer,
        appTeam: appTeamReducer,
        appInstitute: appInstituteReducer,
        dashboard: dashboardReducer,
        candidate: candidateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
