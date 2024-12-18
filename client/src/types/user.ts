export type User = {
  user: {
    id: string
    firstName: string
    lastName: string
    birthDate: string
    email: string
    image: string
    isAdmin: boolean
    notifications: Notification[]
    friends: Friend[]
    emailStatus: EmailStatus
  }
  refreshToken: string
  accessToken: string
}

export type EmailStatus = "unconfirmed" | "pending" | "confirmed"

export type Notification = {
  _id: string
  image: string
  label: string
  userId: string
  message: string
  contact: boolean
  requestDate: string
}

export type Friend = {
  userId: string
  _id: string
  requestDate: string
}

export type LoginUser = {
  email: string
  password: string
}


export type RegisterUser = Omit<DecodedUser, "id" | "isAdmin" | "image" | "notifications" | "friends" | "emailStatus"> & {
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

export type OnlineUser = Pick<DecodedUser, "id" | "firstName" | "lastName" | "image">



