import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      providesTags: (_result, _error, todolistId)=> [{type: 'Task', id: todolistId}]
      //todo: при прив'язуванні до тегу todolistId перевірити чи буде рендеритися всесь тудуліст, чи тільки масив тасок?
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title }
      }),
      invalidatesTags: (_result, _error, arg)=> [{type: 'Task', id: arg.todolistId}]
    }),
    updateTask: build.mutation<BaseResponse<{ item: DomainTask }>, {
      todolistId: string;
      taskId: string;
      model: UpdateTaskModel
    }>({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model
      }),
      invalidatesTags: (_result, _error, arg)=> [{type: 'Task', id: arg.todolistId}],
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, arg)=> [{type: 'Task', id: arg.todolistId}],
    })
  })
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = tasksApi
