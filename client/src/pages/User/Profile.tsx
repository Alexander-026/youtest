import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { UpdateUserForm } from "../../types/user"
import { yupResolver } from "@hookform/resolvers/yup"
import { userUpdateSchema } from "../../schema/userSchema"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import dayjs from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateField, LocalizationProvider } from "@mui/x-date-pickers"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { userSlice } from "../../features/user/userSlice"
import {
  useRemoveUserImageMutation,
  useUpdateUserMutation,
  useUploadUserImageMutation,
} from "../../app/api/usersApiSlice"
import useLocalStorage from "../../hooks/useLocalStorage"
import Upload from "../../components/Upload"

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",
})


const Profile = () => {
  const [visibilityOld, setVisibilityOld] = useState<boolean>(false)
  const [visibilityOldRepeat, setVisibilityOldRepeat] = useState<boolean>(false)
  const [visibilityNew, setVisibilityNew] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [upload] = useUploadUserImageMutation()
  const [update, { isLoading: updateLoading, error: updateError }] =
    useUpdateUserMutation()
  const [removeImg, { isLoading: removeLoading, error: removeError }] =
    useRemoveUserImageMutation()
  const { user } = useAppSelector(state => state.user)
  const [, setToken] = useLocalStorage("accessToken")
  const dispath = useAppDispatch()
  const { onUser } = userSlice.actions
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateUserForm>({
    mode: "all",
    resolver: yupResolver(userUpdateSchema),
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      birthDate: user?.birthDate,
      image: user?.image,
      oldPassword: "",
      repeatOldPassword: "",
      newPassword: "",
    },
  })

  // Form submit event handler
  const onSubmit: SubmitHandler<UpdateUserForm> = async e => {
    const { repeatOldPassword, oldPassword, newPassword, ...updatedData } = e
    try {
      if (user && user.image && !e.image) {
        // await removeImg({ filePath: `./public/${user.image}` })
        await removeImg({ filePath: `public/${user.image}` })
      }
      console.log("formData", formData)
      const res = formData ? await upload(formData).unwrap() : ""
      console.log("res.image", res.image)

      updatedData.image = formData ? res.image.split("/public")[1].replace("/","") : ""

      console.log("updatedData", updatedData)
      const updatedUser = await update({
        ...updatedData,
        oldPassword: oldPassword || "",
        newPassword: newPassword || "",
        id: user!.id,
      }).unwrap()
      dispath(onUser(updatedUser.user))
      setToken(updatedUser.accessToken)
      reset({
        firstName: updatedUser.user.firstName,
        lastName: updatedUser.user.lastName,
        birthDate: updatedUser.user.birthDate,
        email: updatedUser.user.email,
        image: updatedUser.user.image,
        oldPassword: "",
        repeatOldPassword: "",
        newPassword: "",
      })
    } catch (error) {
      console.log("error", e)
      reset()
    } finally {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        ;(activeElement as HTMLElement).blur()
      }
    }
  }

  const isLoading = updateLoading || removeLoading
  const error = updateError || removeError
  return (
    <Box position="relative" flexGrow={1}>
      <Paper
        sx={{ width: { md: "50rem", sm: "30rem" }, mx: "auto", p: "1rem" }}
      >
        <Form
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
          }}
        >
          <Typography variant="h5" align="center">
            Profile
          </Typography>
          {error && (
            <Alert severity="error">{(error as any).data.message}</Alert>
          )}
          <Grid width={"100%"} container spacing={2}>
            <Grid textAlign="center" xs={12}>
              <Upload
                value={getValues().image}
                setFormData={setFormData}
                setValue={setValue}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vorname"
                    size="small"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nachname"
                    size="small"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                      {...field}
                      label="Geburtsdatum"
                      name="birthDate"
                      size="small"
                      value={dayjs(field.value) || null}
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
            </Grid>
            <Grid md={6} xs={12}>
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
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid md={4} xs={12}>
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Old Password"
                    size="small"
                    fullWidth
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword?.message}
                    type={visibilityOld ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => setVisibilityOld(pre => !pre)}
                        >
                          {visibilityOld ? (
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
            </Grid>
            <Grid md={4} xs={12}>
              <Controller
                name="repeatOldPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Repeat Old Password"
                    fullWidth
                    size="small"
                    error={!!errors.repeatOldPassword}
                    helperText={errors.repeatOldPassword?.message}
                    type={visibilityOldRepeat ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => setVisibilityOldRepeat(pre => !pre)}
                        >
                          {visibilityOldRepeat ? (
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
            </Grid>
            <Grid md={4} xs={12}>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    size="small"
                    fullWidth
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    type={visibilityNew ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => setVisibilityNew(pre => !pre)}
                        >
                          {visibilityNew ? (
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
            </Grid>
            <Grid xs={6} textAlign="right">
              <Button
                disabled={!isValid || !isDirty}
                variant="outlined"
                size="small"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </Grid>
            <Grid xs={6} textAlign="left">
              <Button
                type="submit"
                disabled={!isValid || !isDirty || isLoading}
                variant="contained"
                size="small"
              >
                {isLoading ? (
                  <CircularProgress
                    size={22}
                    color="primary"
                    variant="indeterminate"
                  />
                ) : (
                  " Update"
                )}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Box>
  )
}

export default Profile
