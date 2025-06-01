import {instance} from "@/common/instance"
import type {BaseResponse} from "@/common/types"
import type {Todolist} from "./todolistsApi.types"
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AUTH_TOKEN} from "@/common/constants";
import {DomainTodolist} from "@/features/todolists/model/todolists-slice";


export const todolistsApi = createApi({
    reducerPath: 'todolistsApi',
    tagTypes: ['Todolist'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: (headers) => {
            headers.set("API-KEY", import.meta.env.VITE_API_KEY)
            headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
        },
    }),
    endpoints: (build) => ({
        getTodolists: build.query<any[], void>({
            query: () => "/todo-lists",
            transformResponse: (todolists: Todolist[]): DomainTodolist[] => {
                return todolists.map((todolist) => ({...todolist, filter: "all", entityStatus: "idle"}))
            },
            providesTags: ['Todolist'],
        }),
        addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
            query: (title: string) => {
                return {
                    method: 'POST',
                    url: "/todo-lists",
                    body: {title}
                }
            },
            invalidatesTags: ['Todolist'],
        }),
        changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
            query: ({id, title}) => {
                return {
                    method: 'PUT',
                    url: `/todo-lists/${id}`,
                    body: {title}
                }
            },
            invalidatesTags: ['Todolist'],
        }),
        deleteTodolist: build.mutation<BaseResponse, string>({
            query: (id: string) => {
                return {
                    method: 'DELETE',
                    url: `/todo-lists/${id}`,
                }
            },
            invalidatesTags: ['Todolist'],
        }),
    })
})

export const {
    useGetTodolistsQuery,
    useAddTodolistMutation,
    useChangeTodolistTitleMutation,
    useDeleteTodolistMutation
} = todolistsApi

//-------------------------------------------------------------------------
export const _todolistsApi = {
    //+
    getTodolists() {
        return instance.get<Todolist[]>("/todo-lists")
    },
    changeTodolistTitle(payload: { id: string; title: string }) {
        const {id, title} = payload
        return instance.put<BaseResponse>(`/todo-lists/${id}`, {title})
    },
    //+
    createTodolist(title: string) {
        return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`/todo-lists/${id}`)
    },
}
