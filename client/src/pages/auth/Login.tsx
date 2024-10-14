import {
  Alert,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Tooltip,
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
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { userSlice } from "../../features/user/userSlice"
import { TiArrowBack } from "react-icons/ti"

const Login = () => {
  // State for controlling password visibility
  const { user } = useAppSelector(state => state.user)
  const [visibility, setVisibility] = useState<boolean>(false)
  const [login, { isLoading, error }] = useLoginMutation()
  const navigate = useNavigate()
  const dispath = useAppDispatch()
  const { onUser } = userSlice.actions
  // Hook for working with local storage
  const [token, setToken] = useLocalStorage("accessToken")
  const [, setRefreshToken] = useLocalStorage("refreshToken")

  // React-hook-form hook for form management
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
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
      setRefreshToken(loggedUser.refreshToken)
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

  if (user || token) {
    return <Navigate to="/" replace />
  }

  return (
    <Stack
      height={"100vh"}
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
              Login
            </Typography>

            {error && (
              <Alert severity="error">{(error as any).data.message}</Alert>
            )}

            {isLoading ? (
              <>
                {Object.keys(getValues()).map(keyName => (
                  <Skeleton
                    key={keyName}
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ borderRadius: "4px" }}
                  />
                ))}
              </>
            ) : (
              <>
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
                            {visibility ? (
                              <MdVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                />
              </>
            )}

            {/* Button for submitting the form */}
            <Button
              disabled={!isValid || isLoading}
              variant="contained"
              size="small"
              type="submit"
            >
              {isLoading ? "Loading" : "Log in"}
            </Button>

            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Tooltip title="Go to Homepage">
                <Link to={"/"}>
                  <IconButton>
                    <TiArrowBack />
                  </IconButton>
                </Link>
              </Tooltip>

              <Link to="/register">
                <Typography align="right" color="blue">
                  Registration
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}

export default Login
