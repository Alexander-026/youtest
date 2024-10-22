import * as yup from "yup"

const userSchema = {
  firstName: yup
    .string()
    .required("Vorname ist erforderlich")
    .min(3, "mindestens 3 Zeichen"),
  lastName: yup
    .string()
    .required("Nachname ist erforderlich")
    .min(3, "mindestens 3 Zeichen"),
  birthDate: yup.string().required("Geburtsdatum ist erforderlich"),
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mailadresse wird benötigt"),
  password: yup
    .string()
    .required("Passwort wird benötigt")
    .min(3, "mindestens 3 Zeichen"),
  image: yup.string()
}

export const userLoginSchema = yup
  .object({
    email: userSchema.email,
    password: userSchema.password,
  })
  .required()

export const userRegisterSchema = yup.object(userSchema).required()

const { password, ...userRegister } = userSchema

export const userUpdateSchema = yup.object({
  ...userRegister,
  oldPassword: yup
    .string()
    .test(
      "passwords-match",
      "Passwörter stimmen nicht überein",
      function (value) {
        const { repeatOldPassword } = this.parent
        const password = repeatOldPassword as string | undefined

        return password ? password === value : true
      },
    )
    .test("min length oldPassword", "mindestens 3 Zeichen", function (value) {
      return value ? value.length >= 3 : true
    }),
  repeatOldPassword: yup
    .string()
    .test(
      "passwords-match",
      "Passwörter stimmen nicht überein",
      function (value) {
        const { oldPassword } = this.parent
        const password = oldPassword as string | undefined
        return password ? password === value : true
      },
    )
    .test(
      "min length repeatOldPassword",
      "mindestens 3 Zeichen",
      function (value) {
        return value ? value.length >= 3 : true
      },
    ),
  newPassword: yup
    .string()
    .test("min length newPassword", "mindestens 3 Zeichen", function (value) {
      return value ? value.length >= 3 : true
    })
    .test(
      "new password",
      "Das neue Passwort muss sich vom alten unterscheiden",
      function (value) {
        const { oldPassword, repeatOldPassword } = this.parent
        const old = (oldPassword as string | undefined) 
        const repeatedOld = (repeatOldPassword as string | undefined)
        return (old || repeatedOld) ? old !== value && repeatedOld !== value : true
      },
    ),
})
