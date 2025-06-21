import type { RequestStatus } from "@/common/types"
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"

//todo: типізація isCaptcha: null as string | null, але типізація LoginInputs в Login.tsx, де ми прив'зуємо цю капчу, string | undefined (zod)

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "dark" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
    isCaptcha: null as string | null
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: state => state.isLoggedIn,
    selectIsCaptcha: state => state.isCaptcha
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return
        }

        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed"
      })
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    setIsCaptchaAC: create.reducer<{ url: string }>((state, action) => {
      state.isCaptcha = action.payload.url
    })
  })
})

export const {
  selectThemeMode,
  selectAppStatus,
  selectAppError,
  selectIsLoggedIn,
  selectIsCaptcha
} = appSlice.selectors
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setIsLoggedIn, setIsCaptchaAC } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
