import { LoginInputs } from "@/features/auth/lib/schemas"
import { instance } from "@/common/instance"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"


export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me"
    }),
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body
      })
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE"
      })
    })
  })
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi

//======================================================================

export const _authApi = {
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>("/auth/login", payload)
  },
  logout() {
    return instance.delete<BaseResponse>("/auth/login")
  },
  me() {
    return instance.get<BaseResponse<{ userId: number; email: string; login: string }>>(`/auth/me`)
  }
}