import type { BaseResponse } from "@/common/types"
import type { Todolist } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi"
import { DomainTodolist } from "@/features/todolists/lib/types"


export const todolistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
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
