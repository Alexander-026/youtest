import { Badge, IconButton } from "@mui/material"
import { BiMessageSquareDetail } from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { memo, useCallback, useEffect, useState } from "react"
import { useSocketContext } from "../context/socketContext"
import type { Message } from "../types/messages"
import {
  setUnreadMessageAction,
  setUnreadMessagesAction,
} from "../features/chat/chatSlice"
import { useGetUnreadMessagesQuery } from "../app/api/messagesApiSlice"

const MessageNotifications = () => {
  const { selectedConversationId, unreadMessages } = useAppSelector(state => state.chat)

  const { data: dataUnreadMessages } = useGetUnreadMessagesQuery()
  const [hideCount, setHideCount] = useState<boolean>(false)
  const location = useLocation()
  const { socket } = useSocketContext()
  const dispatch = useAppDispatch()
  const socketHandler = useCallback(() => {
    if (!socket) return

    
    // Функция обработки новых сообщений
    const handleNewMessage = (message: Message) => {
      if (!selectedConversationId) {
        console.log("NEw MEssages")
        dispatch(setUnreadMessageAction(message))
      }
    }
    // Функция для обновления прочитанных сообщений
    socket?.on("newMessage", handleNewMessage)
    // Отписываемся от событий при размонтировании или изменении чата
    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [dispatch, selectedConversationId, socket])

  useEffect(() => {
    const unsubscribe = socketHandler()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [socketHandler])

  useEffect(() => {
    setHideCount(location.pathname === "/messages")
  }, [location.pathname])

  useEffect(() => {
    if (dataUnreadMessages) {
      dispatch(setUnreadMessagesAction(dataUnreadMessages))
    }
  }, [dataUnreadMessages, dispatch])


  const countUnreadMessages = unreadMessages.reduce(
    (count, p) => count + p.count,
    0,
  )

  return (
    <Link to="/messages">
      <IconButton size="small">
        <Badge badgeContent={hideCount ? 0 : countUnreadMessages} color="success">
          <BiMessageSquareDetail color="white" fontSize={25} />
        </Badge>
      </IconButton>
    </Link>
  )
}

export default memo(MessageNotifications)
