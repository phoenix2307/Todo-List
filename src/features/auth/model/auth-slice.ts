import {setAppStatusAC} from "@/app/app-slice";
import {createAppSlice, handleServerAppError, handleServerNetworkError} from "@/common/utils";
import {authApi} from "@/features/auth/api/authApi";
import {LoginInputs} from "@/features/auth/lib/schemas";
import {ResultCode} from "@/common/enums";

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
        )
    })
})

export const {selectIsLoggedIn} = authSlice.selectors
export const {loginTC} = authSlice.actions
export const authReducer = authSlice.reducer
