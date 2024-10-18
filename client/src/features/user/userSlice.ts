import {
  onUser,
  logOut,
  acceptFriendship,
  cancelFriendship,
  removeNotification,
  addNewFriendRequest
} from "./userReducers"
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
    acceptFriendship,
    cancelFriendship,
    addNewFriendRequest,
    removeNotification
  },
})

export const {
  acceptFriendship: acceptFriendshipAction,
  cancelFriendship: cancelFriendshipAction,
  removeNotification: removeNotificationAction,
  addNewFriendRequest: addNewFriendRequestAction,
} = userSlice.actions

export default userSlice.reducer
