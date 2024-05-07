import { onUser, logOut } from "./userReducers"
import { createSlice } from "@reduxjs/toolkit"
import type { DecodedUser } from "./../../types/user"
import { localUser } from "../../utils/checkAuth"
export interface IUserState {
  user: DecodedUser | null
}

export const initialUserState: IUserState = {
  user: localUser(),
}

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    onUser,
    logOut,
  },
})

export default userSlice.reducer
