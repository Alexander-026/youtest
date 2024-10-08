
import type { DecodedUser, Friend } from "../../types/user"

import type { IUserState } from "./userSlice"
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

export const onUser: CaseReducer<IUserState, PayloadAction<DecodedUser>> = (
  state,
  action,
) => {
  if (action.payload) {
    state.user = action.payload
    
    // socket.io.opts.query = {
    //   userId: action.payload.id
    // }

    // socket.on("getOnlineUsers", (users) => {
    //    console.log("userssssss", users)
    // });


  
  }
}

export const logOut: CaseReducer<IUserState> = state => {
  state.user = null
}

export const acceptFriendship: CaseReducer<
  IUserState,
  PayloadAction<{ sender: Friend }>
> = (state, action) => {
  const { sender } = action.payload

  if (!state.user) return

  state.user.friendRequests = state.user.friendRequests.filter(
    request => request.userId !== sender.userId,
  )
  state.user.friends.push(sender)
 
}

export const cancelFriendship:CaseReducer<
IUserState,
PayloadAction<{ sender: Friend }>
> = (state, action) => {
  const { sender } = action.payload

  if (!state.user) return

  state.user.friendRequests = state.user.friendRequests.filter(
    request => request.userId !== sender.userId,
  )
   state.user.friends =  state.user.friends.filter(
    (request) => request.userId !== sender.userId
  );

}
