import type React from "react"
import type { Conversation, Message } from "../../../types/messages"
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import MyAvatar from "../../../components/MyAvatar"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { FaAngleDoubleDown } from "react-icons/fa"
import { IoCheckmarkDoneSharp } from "react-icons/io5"
import dayjs from "dayjs"
import { useReadMessageMutation } from "../../../app/api/messagesApiSlice"
import {
  readMessagesAction,
  readUnreadMessagesAction,
} from "../../../features/chat/chatSlice"

type MessagesProps = {
  allMessages: Message[]
  data: Conversation
}

const Messages: React.FC<MessagesProps> = ({ allMessages, data }) => {
  const { user } = useAppSelector(state => state.user)
  const { unreadMessages } = useAppSelector(state => state.chat)
  const dispatch = useAppDispatch()
  const [readMessages] = useReadMessageMutation()
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true)
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false)
  const lastMessageRef = useRef<HTMLLIElement | null>(null)
  const parentBlock = useRef<HTMLLIElement | null>(null)

  const handleScroll = () => {
    if (parentBlock.current) {
      const scrollTop = parentBlock.current.scrollTop
      const scrollHeight = parentBlock.current.scrollHeight
      const clientHeight = parentBlock.current.clientHeight

      if (scrollTop < scrollHeight - clientHeight - 300) {
        setShowScrollDownButton(true)
      } else {
        setShowScrollDownButton(false)
      }
    }
  }

  const readMessagesHandler = useCallback(async () => {
    const unreadMessagesId = allMessages
      .filter(
        m =>
          !m.isRead &&
          m.senderId !== user?.id &&
          m.senderId === data.participant.id,
      )
      .map(m => m.id)
    if (unreadMessagesId.length > 0) {
      const newReadedMessages = await readMessages({
        unreadMessagesId,
        receiverId: data.participant.id,
      }).unwrap()
      dispatch(readMessagesAction(newReadedMessages))
      dispatch(readUnreadMessagesAction(unreadMessages))
    }

    setTimeout(
      () => {
        lastMessageRef.current?.scrollIntoView({
          behavior: isInitialRender ? "auto" : "smooth",
        })
      },
      isInitialRender ? 0 : 100,
    )
    if (isInitialRender) {
      setIsInitialRender(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessages.length])

  useEffect(() => {
    // Добавляем обработчик скролла при монтировании компонента

    let currentBlock = parentBlock.current
    if (currentBlock && !isInitialRender) {
      currentBlock.addEventListener("scroll", handleScroll)
    }

    // Удаляем обработчик при размонтировании компонента
    return () => {
      if (currentBlock) {
        currentBlock.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isInitialRender]) // Пустой массив зависимостей, чтобы следить за скроллом всегда
  useEffect(() => {
    readMessagesHandler()
  }, [readMessagesHandler])

  useEffect(() => {
    if (!isInitialRender) {
      setIsInitialRender(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  return (
    <Box
      ref={parentBlock}
      sx={{
        flex: 1,
        bgcolor: "#212121",
        position: "relative",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari и другие WebKit-браузеры
        },
        "&::-moz-scrollbar": {
          display: "none", // Firefox
        },
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // Internet Explorer и Edge
      }}
    >
      <List sx={{ width: "100%" }}>
        {allMessages.map((m, index) => (
          <ListItem
            key={m.id}
            sx={{
              justifyContent: "flex-start",
            }}
            ref={index === allMessages.length - 1 ? lastMessageRef : null}
          >
            <ListItemAvatar>
              <MyAvatar
                user={
                  m.senderId === user!.id
                    ? {
                        firstName: user!.firstName,
                        lastName: user!.lastName,
                        image: user!.image,
                      }
                    : {
                        firstName: data.participant.firstName,
                        lastName: data.participant.lastName,
                        image: data.participant.image,
                      }
                }
              />
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: "#FFFFFF",
                flex: "inherit",
                WebkitFlex: "inherit",
                minWidth: "10rem",
                maxWidth: "20rem",
                bgcolor: m.senderId === user!.id ? "#193c47" : "#424242",
                padding: "0.5rem",
                borderRadius: "10px",
              }}
              primary={
                <Typography
                  sx={{
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {m.message}
                </Typography>
              }
              secondary={
                <Typography textAlign="right">
                  {`${dayjs(m.createdAt).format("HH:mm")}`}{" "}
                  {m.senderId === user!.id &&
                    (m.isRead ? (
                      <IoCheckmarkDoneSharp color="green" />
                    ) : (
                      <IoCheckmarkDoneSharp color="white" />
                    ))}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      {showScrollDownButton && lastMessageRef.current && (
        <IconButton
          sx={{
            position: "sticky",
            bottom: "1rem",
            right: "1rem",
            float: "right",
            color: "#FFFFFF",
          }}
          onClick={() => {
            lastMessageRef.current?.scrollIntoView({
              behavior: "instant",
            })
          }}
        >
          <FaAngleDoubleDown />
        </IconButton>
      )}
    </Box>
  )
}

export default Messages
