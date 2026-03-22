# 🏗️ OnCampus Architecture Refactor Plan

**Status**: Planning Phase  
**Date**: 2026-03-23  
**Objective**: Eliminate architectural duplication, standardize feature structure, fix state management

---

## 📊 CURRENT STATE ANALYSIS

### ❌ CRITICAL ISSUES IDENTIFIED

#### 1. **Triple Architecture Duplication** (ANTI-PATTERN)
```
Current Flow:
API Layer 1 (services/)  →  Layer 2 (repositories/)  →  Layer 3 (RTK Query)  →  Redux  →  Component
```

**Problem**: 3 different ways to access API data
- Some features use `services/` → `repositories/` → Redux thunks
- Some features use RTK Query endpoints
- Inconsistency everywhere

**Examples**:
- `auth/`: has `services/auth.service.ts`, `repositories/user.repo.ts`, AND `authApi.ts` (RTK Query)
- `batch/`: has `services/batch.service.ts`, `repositories/batch.repo.ts`, but no RTK Query
- `dashboard/`: has massive `dashboardSlice.ts` with createAsyncThunk doing multi-API aggregations

#### 2. **Modules vs Features Confusion**
- **Features** contain: services, repositories, components, slices, hooks
- **Modules** contain: components, forms
- **No clear boundary** — unclear which to use, components exist in both places

**Current structure**:
```
features/
  student/
    ├── (empty - no API layer!)
  auth/
    ├── services/
    ├── repositories/
    ├── components/
    ├── slices/
    ├── hooks/

modules/
  team/
    ├── components/
    ├── forms/
  institute/
    ├── components/
    ├── forms/
```

#### 3. **Redux Misuse**
- `dashboardSlice.ts`: ~500+ lines with many createAsyncThunk calls doing multi-API fetching
- `authSlice.ts`: login/signup/verify thunks mixed with auth state
- `appSlice.ts`: unclear purpose
- **Impact**: All data-fetching is Redux-bound → client-side rendering forced

#### 4. **ReduxProvider in RootLayout**
- `src/providers/ReduxProvider.tsx` placed at top-level in `layout.tsx`
- Forces **entire app** to be client-rendered
- Kills SSR for marketing + public pages
- Bundle includes Redux + all slices for every page

#### 5. **RTK Query Fragmentation**
```
src/services/
  ├── api.ts              (baseApi)
  ├── appUi.api.ts        (appUi endpoints)
  ├── adminDashboard.api.ts
  ├── dashboardTables.api.ts
```
- Not organized by feature
- Unclear which endpoints belong where
- Hard to maintain and locate

---

## ✅ TARGET ARCHITECTURE

### 1. **Folder Structure** (Clean, Predictable)
```
src/
├── app/                          # Next.js routing + SSR
│   ├── page.tsx                  # Server root
│   ├── layout.tsx                # Root layout (NO Redux here!)
│   ├── (public)/                 # Marketing routes (server-rendered)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (dashboard)/              # Protected routes (client)
│   │   ├── layout.tsx            # ReduxProvider HERE
│   │   └── ...
│   └── api/                      # API routes
│
├── modules/                      # UI + orchestration ONLY
│   ├── student/
│   │   ├── components/           # Pure UI components
│   │   ├── screens/              # Page-level UI orchestration
│   │   └── forms/                # Forms (no API calls)
│   ├── team/
│   ├── institute/
│   └── ...
│
├── features/                     # Data layer ONLY (React Query)
│   ├── student/
│   │   ├── api.ts               # React Query hooks (useGetStudents, etc)
│   │   ├── hooks.ts             # Custom hooks
│   │   ├── types.ts             # TypeScript types
│   │   └── index.ts             # Barrel export
│   ├── teacher/
│   ├── batch/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── validations/
│   └── ...
│
├── lib/                          # Shared utilities
│   ├── api/                      # HTTP client setup
│   ├── auth/                     # Auth token helpers
│   ├── hooks/                    # Global hooks (useAuth, useSession)
│   └── utils/
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/Radix
│   ├── common/                   # Shared components
│   └── ...
│
├── store.ts                      # Redux (MINIMAL)
└── providers/
    ├── ReduxProvider.tsx         # Moved to (dashboard) layout
    └── ...
```

### 2. **State Management Pattern**

```
BEFORE (BAD):
API Call → Redux Thunk → Redux Store → Component

AFTER (GOOD):
API Call → React Query → Component
└─ Redux: Only minimal auth + UI state
```

### 3. **Feature API Pattern** (`features/student/api.ts`)

```typescript
// Instead of: services/ + repositories/ + Redux thunks

import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StudentType } from './types';

export const useGetStudents = () =>
  useQuery<StudentType[]>({
    queryKey: ['students'],
    queryFn: () => api.get('/students'),
  });

export const useCreateStudent = () =>
  useMutation({
    mutationFn: (data: CreateStudentInput) =>
      api.post('/students', data),
  });

export const useUpdateStudent = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      api.patch(`/students/${id}`, data),
  });
```

### 4. **Redux Structure** (Minimal Only)

```typescript
// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,     // User session, tokens, permissions
    ui: uiReducer,         // Modal open/close, sidebar state, etc
  },
});

// ❌ REMOVE:
// - dashboardSlice (use React Query instead)
// - appSlice (unclear purpose)
// - All createAsyncThunk calls for API data
```

### 5. **Feature Standardization Example** (Student)

```typescript
// features/student/api.ts
export const useGetStudents = () => useQuery(...);
export const useGetStudent = (id: string) => useQuery(...);
export const useCreateStudent = () => useMutation(...);
export const useUpdateStudent = () => useMutation(...);

// features/student/hooks.ts
export const useStudentFilters = () => {
  const [filters, setFilters] = useState(...);
  return { filters, setFilters };
};

// features/student/types.ts
export interface StudentType { ... }
export interface CreateStudentInput { ... }

// features/student/index.ts
export * from './api';
export * from './hooks';
export * from './types';
```

---

## 🔄 PHASED REFACTOR EXECUTION

### **Phase 1: Analysis & Planning** ✅ CURRENT
- [x] Document current duplication
- [x] Create target architecture
- [ ] Identify all services/repositories to remove

### **Phase 2: Remove Services/Repositories Duplication**
- [ ] Create `features/[name]/api.ts` for each feature
- [ ] Migrate all `services/` logic → `api.ts`
- [ ] Migrate all `repositories/` logic → `api.ts`
- [ ] Delete `services/` and `repositories/` folders

**Features to migrate**:
- auth, batch, billing, course, fee, institute, lead, notes, profile, student, subscription, teacher, team, attendance, whatsapp, integration, dashboard

### **Phase 3: Consolidate RTK Query**
- [ ] Move `src/services/api.ts` endpoints → feature-specific `api.ts`
- [ ] Move `src/services/appUi.api.ts` → feature APIs
- [ ] Move `src/services/adminDashboard.api.ts` → feature APIs
- [ ] Move `src/services/dashboardTables.api.ts` → feature APIs
- [ ] Delete `src/services/` folder

### **Phase 4: Fix State Management**
- [ ] Create React Query `queryClient` setup in `lib/api.ts`
- [ ] Wrap app with `QueryClientProvider` (in Root or Dashboard layout)
- [ ] Remove `dashboardSlice.ts` (replace with queries)
- [ ] Remove `appSlice.ts` (move state to UI reducer)
- [ ] Trim `authSlice.ts` (keep only minimal state)

### **Phase 5: Move ReduxProvider**
- [ ] Remove `<ReduxProvider>` from `src/app/layout.tsx`
- [ ] Add `<ReduxProvider>` to `src/app/(dashboard)/layout.tsx`
- [ ] Ensure public pages are server-rendered

### **Phase 6: Module Cleanup**
- [ ] Remove any API calls from `modules/`
- [ ] Move API-dependent logic to `features/`
- [ ] Keep only UI + forms in `modules/`

### **Phase 7: Performance & SSR**
- [ ] Add ISR to public institute pages
- [ ] Ensure root page uses SSR
- [ ] Verify marketing pages are server-rendered

---

## 📋 VALIDATION CHECKLIST

### After Refactor, Verify:
- [ ] No `services/` folder exists in features
- [ ] No `repositories/` folder exists in features
- [ ] All API data flows through React Query hooks
- [ ] Redux store has ≤ 5 slices (auth, ui only)
- [ ] No `createAsyncThunk` calls remain
- [ ] ReduxProvider is in dashboard layout only
- [ ] Public pages are server-rendered (no client hydration)
- [ ] All tests pass
- [ ] Load tests show improved metrics

---

## 🎯 EXPECTED OUTCOMES

### Before:
- 3 layers of data access (services, repositories, Redux)
- Modules and Features overlapping
- 10+ Redux slices mixing data + UI state
- Entire app client-rendered
- ~150KB+ bundle from unused Redux slices on public pages

### After:
- Single data layer (React Query)
- Clear boundaries (Features = data, Modules = UI)
- 2 Redux slices (auth, ui)
- Server-rendered public pages
- ~80KB+ bundle reduction on public pages
- Consistent, predictable patterns
- Easier to onboard new developers

---

## 📝 NEXT STEPS

1. ✅ Document current state (THIS DOCUMENT)
2. → Start Phase 2: Remove duplication
3. → Create example refactor (student feature)
4. → Execute remaining phases
5. → Final validation and testing

