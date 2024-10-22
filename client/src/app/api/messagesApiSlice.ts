import type { Message, Conversation } from "../../types/messages"
import { apiSlice } from "./apiSlice"

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<
      Message,
      { receiverId: string; message: string }
    >({
      query: ({ receiverId, message }) => {
        return {
          url: `${import.meta.env.VITE_MESSAGES_URL}/send/${receiverId}`,
          method: "POST",
          body: { message },
        }
      },
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
  }),
})

export const {
  useSendMessageMutation,
  useGetConvarsationsQuery,
  useLazyGetConvarsationQuery,
} = messageApiSlice
