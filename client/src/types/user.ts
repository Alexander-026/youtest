export type User = {
  user: {
    id: string
    firstName: string
    lastName: string
    birthDate: string
    email: string
    image: string
    isAdmin: boolean
  }
  refreshToken: string
  accessToken: string
}

export type LoginUser = {
  email: string
  password: string
}

export type RegisterUser = Omit<DecodedUser, "id" | "isAdmin" | "image"> & {
  password: string
  image?: string
}

export type UpdateUserForm = Omit<RegisterUser, "password"> & {
  oldPassword?: string
  repeatOldPassword?: string
  newPassword?: string
}

export type UpdateUser = Omit<RegisterUser, "password"> & {
  oldPassword: string, 
  newPassword: string,
  id: string
}

export type ContactMe = {
  fullName: string
  email: string
  text: string
}
export type DecodedUser = User["user"]
