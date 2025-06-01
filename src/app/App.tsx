// import "./App.css"
import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import styles from "./App.module.css"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { useDispatch } from "react-redux"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const dispatch = useDispatch()


  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (isLoading) return
    setIsInitialized(true)

    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    }
  }, [data, isLoading])


  if (!isInitialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
