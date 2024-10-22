import {
  onUser,
  logOut,
  acceptFriendship,
  cancelFriendship,
  removeNotification,
  addNewFriendRequest, 
  setOnlineUsers
} from "./userReducers"
import { createSlice } from "@reduxjs/toolkit"
import type { DecodedUser, OnlineUser } from "./../../types/user"
import { localUser } from "../../utils/checkAuth"
export interface IUserState {
  user: DecodedUser | null
  onlineUsers: OnlineUser[]
}

export const initialUserState: IUserState = {
  user: localUser(),
  onlineUsers: []
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
    removeNotification,
    setOnlineUsers
  },
})

export const {
  acceptFriendship: acceptFriendshipAction,
  cancelFriendship: cancelFriendshipAction,
  removeNotification: removeNotificationAction,
  addNewFriendRequest: addNewFriendRequestAction,
  setOnlineUsers: setOnlineUsersAction
} = userSlice.actions

export default userSlice.reducer
