import { selectIsCaptcha, selectIsLoggedIn, selectThemeMode, setIsCaptchaAC, setIsLoggedIn } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { Navigate } from "react-router"
import { Path } from "@/common/routing"
import { useLazyFetchCaptchaQuery, useLoginMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const captchaUrl = useAppSelector(selectIsCaptcha)

  const [login] = useLoginMutation()
  const [fetchCaptchaTrigger] = useLazyFetchCaptchaQuery()

  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" }
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log("Submitted data", data)
    login(data).then((res) => {
      console.log("Server response", res)
      if (res.data?.resultCode === ResultCode.Success) {
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
      if (res.data?.resultCode === ResultCode.CaptchaError) {
        fetchCaptchaTrigger().then(res => {
          if (res.data?.url) {
            dispatch(setIsCaptchaAC({ url: res.data.url }))
          }
        })
      }
    })
  }

  if (isLoggedIn) return <Navigate to={Path.Main} />

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />

            {captchaUrl && (
              <>
                <img src={captchaUrl} alt="captcha" />
                <TextField
                  label="Enter captcha"
                  margin="normal"
                  error={!!errors.captcha}
                  {...register("captcha")}
                />
                {errors.captcha && <span className={styles.errorMessage}>{errors.captcha.message}</span>}
              </>
            )}

            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
