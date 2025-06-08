import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { setAppErrorAC } from "@/app/app-slice.ts"
import { isErrorWithMessage } from "@/common/utils"
import { ResultCode } from "@/common/enums"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      }
    })(args, api, extraOptions)

    let error = "Some error occurred"

    // 1. Global query errors
    if (result.error) {
      switch (result.error.status) {
        case "FETCH_ERROR":
        case "PARSING_ERROR":
        case "CUSTOM_ERROR":
          error = result.error.error
          break
        case 403:
          error = "403 Forbidden Error. Check API-KEY"
          break
        case 400:
        case 500:
          if (isErrorWithMessage(result.error.data)) {
            error = result.error.data.message
          } else {
            error = JSON.stringify(result.error.data)
          }
      }
      api.dispatch(setAppErrorAC({ error }))
    }

    // 2. Result code errors
    if ( (result.data as {resultCode: ResultCode}).resultCode === ResultCode.Error ) {
      const messages = (result.data as {messages: string[]}).messages
      error = messages.length ? messages[0] : error
      api.dispatch(setAppErrorAC({ error }))
    }

    // if (result.error){
    //   if (result.error.status === 'FETCH_ERROR' || result.error.status === 'PARSING_ERROR') {
    //     api.dispatch(setAppErrorAC({error: result.error.error}))
    //   }
    //   if(result.error.status === 403){
    //     api.dispatch(setAppErrorAC({error: '403 Forbidden Error. Check API-KEY'}))
    //   }
    //   if(result.error.status === 400 || result.error.status === 500){
    //     if (isErrorWithMessage(result.error.data)) {
    //         api.dispatch(setAppErrorAC({ error: result.error.data.message }))
    //       } else {
    //         api.dispatch(setAppErrorAC({ error: JSON.stringify(result.error.data) }))
    //       }
    //   }
    //   // ✅ 1. Type Assertions
    //   // api.dispatch(setAppErrorAC({error: (result.error.data as {message: string}).message}))
    //   // ✅ 2. JSON.stringify
    //   // api.dispatch(setAppErrorAC({ error: JSON.stringify(result.error.data) }))
    //   // ✅ 3. Type Predicate
    //   // if (isErrorWithMessage(result.error.data)) {
    //   //   api.dispatch(setAppErrorAC({ error: result.error.data.message }))
    //   // } else {
    //   //   api.dispatch(setAppErrorAC({ error: JSON.stringify(result.error.data) }))
    //   // }
    // }

    return result
  },

  endpoints: () => ({})
})
