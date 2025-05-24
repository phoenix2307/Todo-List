import {setAppStatusAC} from "@/app/app-slice";
import {createAppSlice, handleServerAppError, handleServerNetworkError} from "@/common/utils";
import {authApi} from "@/features/auth/api/authApi";
import {LoginInputs} from "@/features/auth/lib/schemas";
import {ResultCode} from "@/common/enums";
import {AUTH_TOKEN} from "@/common/constants";

export const authSlice = createAppSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    selectors: {
        selectIsLoggedIn: state => state.isLoggedIn
    },
    reducers: (creator) => ({
        loginTC: creator.asyncThunk(
            async (data: LoginInputs, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({ status: "loading" }))
                    const res = await authApi.login(data)

                    if (res.data.resultCode === ResultCode.Success) {
                        dispatch(setAppStatusAC({ status: "succeeded" }))
                        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
                        return {isLoginIn: true}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoginIn
                },
            },
        ),
        logoutTC: creator.asyncThunk(
            async (_, {dispatch, rejectWithValue}) => {
                try {
                    dispatch(setAppStatusAC({ status: "loading" }))
                    const res = await authApi.logout()

                    if (res.data.resultCode === ResultCode.Success) {
                        dispatch(setAppStatusAC({ status: "succeeded" }))
                        localStorage.removeItem(AUTH_TOKEN)
                        return {isLoginIn: false}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(dispatch, error)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    state.isLoggedIn = action.payload.isLoginIn
                },
            },
        )
    })
})

export const {selectIsLoggedIn} = authSlice.selectors
export const {loginTC, logoutTC} = authSlice.actions
export const authReducer = authSlice.reducer
