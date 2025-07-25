import { TaskStatus } from "@/common/enums"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/common/hooks"
import { setAppErrorAC } from "@/app/app-slice.ts"
import { DomainTodolist } from "@/features/todolists/lib/types"
import {
  TasksPagination
} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"


type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const dispatch = useAppDispatch()

  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useGetTasksQuery({
    todolistId: id,
    params: { page }
  })



  useEffect(() => {
    if (!error) return
    if ("status" in error) {
      const errorMsg = "error" in error ? error.error : JSON.stringify(error.data)
      dispatch(setAppErrorAC({ error: errorMsg }))
    } else {
      dispatch(setAppErrorAC({ error: error.message || "Some error occurred" }))
    }
  }, [error])

  if (isLoading) {
    return <TasksSkeleton />
  }

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }


  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}</List>
          <TasksPagination
          totalCount={data?.totalCount || 0}
          page={page}
          setPage={setPage}/>
        </>

      )}
    </>
  )
}
