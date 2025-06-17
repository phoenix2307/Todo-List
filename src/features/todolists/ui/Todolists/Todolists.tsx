import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Box from "@mui/material/Box"
import { containerSx } from "@/common/styles"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton.tsx"

export const Todolists = () => {

  const { data, isLoading } = useGetTodolistsQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  })

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3).fill(null).map((_, id) => (
          <TodolistSkeleton key={id} />
        ))}
      </Box>
    )
  }

  return (
    <>
      {data?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
