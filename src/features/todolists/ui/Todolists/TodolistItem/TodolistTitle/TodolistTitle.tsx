import {EditableSpan} from "@/common/components"
import {type DomainTodolist,} from "@/features/todolists/model/todolists-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {useChangeTodolistTitleMutation, useDeleteTodolistMutation} from "@/features/todolists/api/todolistsApi";

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({todolist}: Props) => {
    const {id, title, entityStatus} = todolist

    const [removeTodolist] = useDeleteTodolistMutation()
    const [updateTodolistTitle] = useChangeTodolistTitleMutation()

    const deleteTodolist = () => {
        removeTodolist(id)
    }

    const changeTodolistTitle = (title: string) => {
        updateTodolistTitle({id, title})
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitle}/>
            </h3>
            <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}
