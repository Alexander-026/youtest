import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import { useLazyGetConvarsationQuery } from "../../../app/api/messagesApiSlice"
import { memo, useCallback, useEffect } from "react"
import MessageInput from "./MessageInput"
import { useSocketContext } from "../../../context/socketContext"
import type { Message } from "../../../types/messages"
import Messages from "./Messages"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  readMessagesAction,
  setAllMessagesAction,
  setMessageAction,
  setUnreadMessageAction,
} from "../../../features/chat/chatSlice"
import HeaderChat from "./HeaderChat"

const ChatField = () => {
  const { selectedConversationId, allMessages } = useAppSelector(
    state => state.chat,
  )
  const dispatch = useAppDispatch()
  const { socket } = useSocketContext()
  const [getConversation, { data, isLoading, isError}] =
    useLazyGetConvarsationQuery()

  const conversationHandler = useCallback(() => {
    if (selectedConversationId) {
      getConversation({ conversationId: selectedConversationId }).then(
        ({ data }) => {
          dispatch(setAllMessagesAction(data?.messages || []))
        },
      )
    }
  }, [selectedConversationId, getConversation, dispatch])

  const socketHandler = useCallback(() => {
    if (!selectedConversationId || !socket) return

    // Функция обработки новых сообщений
    const handleNewMessage = (message: Message) => {
      if (message.conversationId === selectedConversationId) {
        dispatch(setMessageAction(message))
      }else if(message.conversationId !== selectedConversationId ) {
        console.log("setUnreadMessageActionsetUnreadMessageAction", message)
        dispatch(setUnreadMessageAction(message))
      }
    }

    // Функция для обновления прочитанных сообщений
    const handleReadMessages = (messages: Message[]) => {
      dispatch(readMessagesAction(messages))
    }
    socket?.on("newMessage", handleNewMessage)
    socket?.on("readMessages", handleReadMessages)

    // Отписываемся от событий при размонтировании или изменении чата
    return () => {
      socket.off("newMessage", handleNewMessage)
      socket.off("readMessages", handleReadMessages)
    }
  }, [dispatch, selectedConversationId, socket])

  useEffect(() => {
    const unsubscribe = socketHandler()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [socketHandler])

  useEffect(() => {
    conversationHandler()
  }, [conversationHandler])

  return (
    <Box
      sx={{
        flex: 1,
        flexDirection: data ? "column" : "row",
        display: "flex",
        position: "relative",
        backgroundColor: "#212121",
        borderRadius: {md: "10px", xs: 0},
        overflow: "hidden",
      }}
      component="main"
    >
      {!data && (
        <Stack flex={1} justifyContent="center" alignItems="center">
          <Typography color="white" variant="h5">
            Select a chat to start messaging
          </Typography>
        </Stack>
      )}
      <Backdrop
        sx={{
          color: "#FFFFFF",
          backgroundColor: "#212121",
          zIndex: theme => theme.zIndex.drawer + 1,
          position: "absolute",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {data && (
        <>
          <HeaderChat data={data} />
          <Messages allMessages={allMessages} data={data} />
          <MessageInput receiverId={data.participant.id} />
        </>
      )}
    </Box>
  )
}

export default memo(ChatField)
