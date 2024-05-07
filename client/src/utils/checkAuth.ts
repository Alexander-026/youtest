import type { DecodedUser, User } from "../types/user"
import { jwtDecode } from "jwt-decode"

export const localUser = (): DecodedUser | null => {
  const data = localStorage.getItem("accessToken")

  if (data) {
    const decodedUser = jwtDecode<User>(data)
    return decodedUser.user
  } else {
    return null
  }
}
