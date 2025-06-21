import type { BaseResponse } from "@/common/types"
import type { Todolist } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi"
import { DomainTodolist } from "@/features/todolists/lib/types"


export const todolistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "/todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] => {
        return todolists.map((todolist) => ({ ...todolist, filter: "all"}))
      },
      providesTags: ["Todolist"]
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title: string) => {
        return {
          method: "POST",
          url: "/todo-lists",
          body: { title }
        }
      },
      invalidatesTags: ["Todolist"]
    }),
    changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => {
        return {
          method: "PUT",
          url: `/todo-lists/${id}`,
          body: { title }
        }
      },
      invalidatesTags: ["Todolist"]
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (id: string) => ({
        method: "DELETE",
        url: `/todo-lists/${id}`
      }),
      async onQueryStarted(id: string, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
            const index = state.findIndex(todolist => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ["Todolist"]
    })
  })
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation
} = todolistsApi
