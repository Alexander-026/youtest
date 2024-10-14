import { useState } from "react"
import {
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  IconButton,
  TextField,
  Skeleton,
  Tooltip,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateField } from "@mui/x-date-pickers/DateField"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import type { RegisterUser } from "../../types/user"
import { Link, Navigate, useNavigate } from "react-router-dom"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { userRegisterSchema } from "../../schema/userSchema"
import { yupResolver } from "@hookform/resolvers/yup"
import { MdVisibility } from "react-icons/md"
import { MdVisibilityOff } from "react-icons/md"
import dayjs from "dayjs"
import { useRegisterMutation } from "../../app/api/usersApiSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useLocalStorage from "../../hooks/useLocalStorage"
import { userSlice } from "../../features/user/userSlice"
import { TiArrowBack } from "react-icons/ti"

const Register = () => {
  const { user } = useAppSelector(state => state.user)
  const [visibility, setVisibility] = useState<boolean>(false)

  const [register, { isLoading, error }] = useRegisterMutation()
  const navigate = useNavigate()
  const dispath = useAppDispatch()
  const { onUser } = userSlice.actions
  // Hook for working with local storage
  const [token, setToken] = useLocalStorage("accessToken")
  const [, setRefreshToken] = useLocalStorage("refreshToken")

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterUser>({
    mode: "all",
    resolver: yupResolver(userRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      // image: "",
    },
  })

  // Form submit event handler
  const onSubmit: SubmitHandler<RegisterUser> = async e => {
    try {
      console.log("e", e)
      const registeredUser = await register(e).unwrap()
      dispath(onUser(registeredUser.user))
      setToken(registeredUser.accessToken)
      setRefreshToken(registeredUser.refreshToken)
      navigate("/", { replace: true })
    } catch (e) {
      console.log("error", e)
    } finally {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        ;(activeElement as HTMLElement).blur()
      }
      reset()
      setValue("birthDate", "")
    }
  }

  if (user || token) {
    return <Navigate to="/" replace />
  }

  console.log("getValues", Object.keys(getValues()))

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
            {/* Form title */}
            <Typography variant="h5" align="center">
              Registration
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
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      size="small"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      size="small"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        {...field}
                        label="Birth Date"
                        name="birthDate"
                        size="small"
                        value={
                          field.value || errors.birthDate
                            ? dayjs(field.value)
                            : null
                        }
                        onChange={date => {
                          if (date) {
                            field.onChange(dayjs(date).format("YYYY-MM-DD"))
                          }
                        }}
                        color={errors.birthDate ? "error" : "primary"}
                        onClear={() => setValue("birthDate", "")}
                        disableFuture
                        format="DD.MM.YYYY"
                        helperText={errors.birthDate?.message}
                        clearable={!!field.value}
                        fullWidth
                      />
                    </LocalizationProvider>
                  )}
                />

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

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
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

            <Button
              disabled={!isDirty}
              variant="outlined"
              size="small"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              variant="contained"
              size="small"
            >
              {isLoading ? "Loading" : "Registrieren"}
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

              <Link to="/login">
                <Typography align="right" color="blue">
                  Login
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}

export default Register
