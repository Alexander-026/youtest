import type React from "react"
import type { DecodedUser } from "../types/user"
import { Avatar } from "@mui/material"

type MyAvatarTypes = {
  user: Pick<DecodedUser, "firstName" | "lastName" | "image">
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  }
}

const MyAvatar: React.FC<MyAvatarTypes> = ({ user }) => {
  return (
    <Avatar
      {...stringAvatar(`${user.firstName} ${user.lastName}`)}
      src={`${import.meta.env.VITE_LOCAL_URL}/${user.image}`}
      // src={`${import.meta.env.VITE_BASE_URL}/${user.image}`}
    />
  )
}

export default MyAvatar
