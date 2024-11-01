import type { Message, Conversation, UnreadMessage } from "../../types/messages"
import { apiSlice } from "./apiSlice"

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<
      Message,
      { receiverId: string; message: string }
    >({
      query: ({ receiverId, message }) => ({
        url: `${import.meta.env.VITE_MESSAGES_URL}/send/${receiverId}`,
        method: "POST",
        body: { message },
      }),
    }),
    readMessage: builder.mutation<
      Message[],
      { receiverId: string; unreadMessagesId: string[] }
    >({
      query: ({ receiverId, unreadMessagesId }) => ({
        url: `${import.meta.env.VITE_MESSAGES_URL}/read/${receiverId}`,
        method: "POST",
        body: { unreadMessagesId },
      }),
     
    }),
    getConvarsations: builder.query<Omit<Conversation, "messages">[], void>({
      query: () => ({
        url: `${import.meta.env.VITE_MESSAGES_URL}/conversations`,
      }),
    }),
    getConvarsation: builder.query<Conversation, { conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `${import.meta.env.VITE_MESSAGES_URL}/conversation/${conversationId}`,
      }),
    }),
    getUnreadMessages: builder.query<UnreadMessage[], void>({
      query: () => ({
        url: `${import.meta.env.VITE_MESSAGES_URL}/getUnreadMessages`,
      }),
    }),
  }),
})

export const {
  useSendMessageMutation,
  useReadMessageMutation,
  useGetConvarsationsQuery,
  useLazyGetConvarsationQuery,
  useGetUnreadMessagesQuery
} = messageApiSlice
