import {
  Alert,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { userLoginSchema } from "../../schema/userSchema"
import { MdVisibility } from "react-icons/md"
import { MdVisibilityOff } from "react-icons/md"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useLoginMutation } from "../../app/api/usersApiSlice"
import type { LoginUser } from "../../types/user"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useAppDispatch } from "../../app/hooks"
import { userSlice } from "../../features/user/userSlice"

const Login = () => {
  // State for controlling password visibility
  const [visibility, setVisibility] = useState<boolean>(false)
  const [login, { isLoading, error }] = useLoginMutation()
  const navigate = useNavigate()
  const dispath = useAppDispatch()
  const { onUser } = userSlice.actions
  // Hook for working with local storage
  const [token, setToken] = useLocalStorage("accessToken")

  // React-hook-form hook for form management
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginUser>({
    mode: "all",
    resolver: yupResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handler for submitting form data
  const onSubmit: SubmitHandler<LoginUser> = async e => {
    try {
      const loggedUser = await login(e).unwrap()
      dispath(onUser(loggedUser.user))
      setToken(loggedUser.accessToken)
      navigate("/", { replace: true })
    } catch (e) {
      console.log("error", e)
    } finally {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        ;(activeElement as HTMLElement).blur()
      }
      reset()
    }
  }

  if (token) {
    return <Navigate to="/" replace />
  }

  



  return (
    <Stack
      flexGrow={1}
      direction={"row"}
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        sx={{
          padding: "1rem",
          width: { sm: "20rem", xs: "100%" },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" gap={{ xs: 2, sm: 3 }}>
            <Typography variant="h5" textAlign="center">
              Anmelden
            </Typography>

            {error && (
              <Alert severity="error">{(error as any).data.message}</Alert>
            )}

            {/* Component for controlling the email field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Component for controlling the password field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Passwort"
                  size="small"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  type={visibility ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => setVisibility(pre => !pre)}
                      >
                        {visibility ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />

            {/* Button for submitting the form */}
            <Button
              disabled={!isValid || isLoading}
              variant="contained"
              size="small"
              type="submit"
            >
              {isLoading ? "Loading" : "Anmelden"}
            </Button>

            {/* Link for navigating to the registration page */}
            <Link to="/register">
              <Typography align="right" color="blue">
                Registrierung
              </Typography>
            </Link>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}

export default Login
