import type { DecodedUser, Friend, Notification, OnlineUser } from "../../types/user"

import type { IUserState } from "./userSlice"
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

export const onUser: CaseReducer<IUserState, PayloadAction<DecodedUser>> = (
  state,
  action,
) => {
  if (action.payload) {
    state.user = action.payload
  }
}

export const logOut: CaseReducer<IUserState> = state => {
  state.user = null
}

export const acceptFriendship: CaseReducer<
  IUserState,
  PayloadAction<{ sender: Notification }>
> = (state, action) => {
  const { sender } = action.payload

  if (!state.user) return

  state.user.notifications = state.user.notifications.filter(
    request => request.userId !== sender.userId,
  )
  state.user.friends.push({
    _id: sender._id,
    requestDate: sender.requestDate,
    userId: sender.userId,
  })
}

export const cancelFriendship: CaseReducer<
  IUserState,
  PayloadAction<string>
> = (state, action) => {
 

  if (!state.user) return

  state.user.notifications = state.user.notifications.filter(
    request => request.userId !== action.payload,
  )
  state.user.friends = state.user.friends.filter(
    request => request.userId !== action.payload,
  )
}

export const addNewFriendRequest: CaseReducer<
  IUserState,
  PayloadAction<Notification>
> = (state, action) => {
  if (!state.user) return
  state.user.notifications.push(action.payload)
}


export const removeNotification:CaseReducer<
IUserState,
PayloadAction<string>
> = (state, action) => {
  if (!state.user) return
  state.user.notifications = state.user.notifications.filter((n) => n._id !== action.payload)
}



export const setOnlineUsers:CaseReducer<IUserState, PayloadAction<OnlineUser[]>> = (state, action) => {
  state.onlineUsers = action.payload
}
