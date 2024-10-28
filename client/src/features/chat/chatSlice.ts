import { createSlice } from "@reduxjs/toolkit"
import type { Message, UnreadMessage } from "../../types/messages"
import getLocalItem from "../../utils/getLocalItem"
import {
  leaveConversation,
  readMessages,
  readUnreadMessages,
  selectConversation,
  setAllMessages,
  setMessage,
  setUnreadMessages,
  setUnreadMessage
} from "./chatReducers"

export interface IChatState {
  selectedConversationId: string
  allMessages: Message[]
  unreadMessages: UnreadMessage[]
}

export const intialChatState: IChatState = {
  selectedConversationId: getLocalItem<string>("selectedChatId") || "",
  allMessages: [],
  unreadMessages:  getLocalItem<UnreadMessage[]>("unreadMessages") || [],
}

export const chatSlice = createSlice({
  name: "chat",
  initialState: intialChatState,
  reducers: {
    selectConversation,
    leaveConversation,
    setAllMessages,
    setMessage,
    readMessages,
    readUnreadMessages,
    setUnreadMessages,
    setUnreadMessage
  },
})
export const {
  leaveConversation: leaveConversationACtion,
  selectConversation: selectConversationAction,
  setAllMessages: setAllMessagesAction,
  setMessage: setMessageAction,
  readMessages: readMessagesAction,
  setUnreadMessages: setUnreadMessagesAction,
  readUnreadMessages: readUnreadMessagesAction,
  setUnreadMessage: setUnreadMessageAction
} = chatSlice.actions

export default chatSlice.reducer
