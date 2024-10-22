import { Box, CircularProgress, IconButton, Input } from "@mui/material"
import type React from "react"
import { useCallback, useState } from "react"
import { IoSend } from "react-icons/io5"
import { useSendMessageMutation } from "../../../app/api/messagesApiSlice"
import type { Message } from "../../../types/messages"

type MessageInputProps = {
  receiverId: string
  setAllMessages: (message: Message) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  receiverId,
  setAllMessages,
}) => {
  const [send, { isError, isLoading }] = useSendMessageMutation()
  const [message, setMessage] = useState("")

  const handlerSendMessage = useCallback(
    async (newMessage: string) => {
      const data = await send({
        receiverId,
        message: newMessage,
      }).unwrap()

      console.log(
        " setMessages(message) setMessages(message) setMessages(message)",
        message,
      )
      setAllMessages(data)
      setMessage("")
    },
    [receiverId, send, setAllMessages],
  )

  return (
    <Box
      sx={{
        bgcolor: "#424242",
        borderLeft: "1px solid #212121",
        display: "flex",
      }}
    >
      <Input
        multiline
        minRows={1}
        maxRows={5}
        fullWidth
        placeholder="Write a message"
        sx={{ padding: "1rem", color: "#FFFFFF" }}
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <IconButton
        disabled={!message || isLoading}
        onClick={() => handlerSendMessage(message)}
      >
        {isLoading ? (
          <CircularProgress size={20}  sx={{color:"#3949a"}} />
        ) : (
          <IoSend color={message ? "#FFFFFF" : "#2626262"} />
        )}
      </IconButton>
    </Box>
  )
}

export default MessageInput
