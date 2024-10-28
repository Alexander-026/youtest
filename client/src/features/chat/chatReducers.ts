import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit"
import type { IChatState } from "./chatSlice"
import type { Message, UnreadMessage } from "../../types/messages"

export const selectConversation: CaseReducer<
  IChatState,
  PayloadAction<string>
> = (state, action) => {
  localStorage.setItem("selectedChatId", JSON.stringify(action.payload))
  state.selectedConversationId = action.payload
}

export const leaveConversation: CaseReducer<IChatState> = state => {
  localStorage.removeItem("selectedChatId")
  state.selectedConversationId = ""
}

export const setAllMessages: CaseReducer<
  IChatState,
  PayloadAction<Message[]>
> = (state, action) => {
  state.allMessages = action.payload
}
export const setMessage: CaseReducer<IChatState, PayloadAction<Message>> = (
  state,
  action,
) => {
  state.allMessages.push(action.payload)
}

export const readMessages: CaseReducer<IChatState, PayloadAction<Message[]>> = (
  state,
  action,
) => {
  const messages = action.payload
  state.allMessages = state.allMessages.map(
    message => messages.find(newMsg => newMsg.id === message.id) || message,
  )
}

export const setUnreadMessages: CaseReducer<
  IChatState,
  PayloadAction<UnreadMessage[]>
> = (state, action) => {
  localStorage.setItem("unreadMessages", JSON.stringify(action.payload))
  state.unreadMessages = action.payload
}

export const setUnreadMessage: CaseReducer<
  IChatState,
  PayloadAction<Message>
> = (state, action) => {
  const unreadMessages =
    state.unreadMessages.length > 0
      ? state.unreadMessages.map(message =>
          message.conversationId === action.payload.conversationId
            ? { ...message, count: message.count + 1 }
            : message,
        )
      : state.unreadMessages.concat({
          conversationId: action.payload.conversationId,
          count: 1,
        })
  localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages))
  state.unreadMessages = unreadMessages
}

export const readUnreadMessages: CaseReducer<
  IChatState,
  PayloadAction<UnreadMessage[]>
> = (state, action) => {
  const unreadMessages = state.unreadMessages.filter(
    m => !action.payload.find(um => um.conversationId === m.conversationId),
  )
  localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages))
  state.unreadMessages = unreadMessages
}

export const toChat: CaseReducer<IChatState, PayloadAction<string>> = (state, action) => {
  
}
