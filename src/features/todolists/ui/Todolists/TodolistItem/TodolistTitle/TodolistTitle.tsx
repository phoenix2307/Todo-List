import { EditableSpan } from "@/common/components"
import { type DomainTodolist } from "@/features/todolists/model/todolists-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation
} from "@/features/todolists/api/todolistsApi"
import { RequestStatus } from "@/common/types"
import { useAppDispatch } from "@/common/hooks"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [removeTodolist] = useDeleteTodolistMutation()
  const [updateTodolistTitle] = useChangeTodolistTitleMutation()

  const dispatch = useAppDispatch()
  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find(tl => tl.id === id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      })
    )
  }

  const deleteTodolist = () => {
    changeTodolistStatus("loading")
    removeTodolist(id)
      .unwrap()
      .catch(() => changeTodolistStatus("idle"))

  }

  const changeTodolistTitle = (title: string) => {
    updateTodolistTitle({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
