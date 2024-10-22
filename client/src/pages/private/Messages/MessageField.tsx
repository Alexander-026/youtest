import {
  Backdrop,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import type React from "react"
import { useLazyGetConvarsationQuery } from "../../../app/api/messagesApiSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import MyAvatar from "../../../components/MyAvatar"
import MessageInput from "./MessageInput"
import dayjs from "dayjs"
import { useSocketContext } from "../../../context/socketContext"
import type { Message } from "../../../types/messages"

const MessageField: React.FC<{ conversationId: string }> = ({
  conversationId,
}) => {
  const { user } = useAppSelector(state => state.user)
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const lastMessageRef = useRef<HTMLLIElement | null>(null)
  const { socket } = useSocketContext()
  const [getConversation, { data, isLoading, isError }] =
    useLazyGetConvarsationQuery()

  const conversationHandler = useCallback(() => {
    if (conversationId) {
      getConversation({ conversationId }).then(({ data }) => {
        setAllMessages(data?.messages || [])
      })
    }
  }, [conversationId, getConversation])

  const socketHandler = useCallback(() => {
    socket?.on("newMessage", (message: Message) => {
      console.log("newMessage", message)
      setAllMessages(pre => [...pre, message])
    })

    return () => {
      socket?.off("newMessage")
    }
  }, [socket])

  useEffect(() => {
    socketHandler()
  }, [socketHandler])

  useEffect(() => {
    conversationHandler()
  }, [conversationHandler])

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [allMessages])


  return (
    <Box
      sx={{
        flex: 1,
        flexDirection: data ? "column" : "row",
        display: "flex",
        bgcolor: "orange",
        position: "relative",
      }}
      component="main"
    >
      {!data && (
        <Stack flex={1} justifyContent="center" alignItems="center">
          <Typography variant="h5">Select a chat to start messaging</Typography>
        </Stack>
      )}
      <Backdrop
        sx={{
          color: "#FFFFFF",
          backgroundColor: "#424242",
          zIndex: theme => theme.zIndex.drawer + 1,
          position: "absolute",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {data && (
        <>
          <Box
            bgcolor={"#424242"}
            borderLeft={1}
            borderColor={"#212121"}
            height={"4rem"}
          >
            <Typography color="#FFFFFF">
              {data.participant.firstName} {data.participant.lastName}
            </Typography>
          </Box>
          <Box
            flex={1}
            sx={{
              bgcolor: "#212121",
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
              {allMessages.map(m => (
                <ListItem
                  key={m.id}
                  sx={{
                    justifyContent: "flex-start",
                  }}
                  ref={lastMessageRef}
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
                      bgcolor: m.senderId === user!.id ? "#3949ab" : "#424242",
                      padding: "0.5rem",
                      borderRadius: "10px"
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
                      <Typography textAlign="right">{`${dayjs(m.createdAt).format("HH:mm")}`}</Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <MessageInput
            receiverId={data.participant.id}
            setAllMessages={newMes => setAllMessages(pre => [...pre, newMes])}
          />
        </>
      )}
    </Box>
  )
}

export default MessageField
