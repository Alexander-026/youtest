import type { DecodedUser } from "../../types/user"

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
