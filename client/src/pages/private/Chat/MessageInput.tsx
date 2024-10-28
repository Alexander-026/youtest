import { Box, CircularProgress, IconButton, Input } from "@mui/material"
import type React from "react"
import { useCallback, useState } from "react"
import { IoSend } from "react-icons/io5"
import { useSendMessageMutation } from "../../../app/api/messagesApiSlice"
import { useAppDispatch } from "../../../app/hooks"
import { setMessageAction } from "../../../features/chat/chatSlice"

type MessageInputProps = {
  receiverId: string
}

const MessageInput: React.FC<MessageInputProps> = ({ receiverId }) => {
  const [send, { isError, isLoading }] = useSendMessageMutation()
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState("")

  const handlerSendMessage = useCallback(
    async (newMessage: string) => {
      setMessage("")
      const data = await send({
        receiverId,
        message: newMessage,
      }).unwrap()
      dispatch(setMessageAction(data))
    },
    [dispatch, receiverId, send],
  )

  const isValid = (mes: string): boolean => {
    return mes.trim().length > 0
  }

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
        disabled={!isValid(message) || isLoading}
        sx={{ color: "#FFFFFF" }}
        onClick={() => handlerSendMessage(message)}
      >
        {isLoading ? (
          <CircularProgress size={20} sx={{ color: "#3949a" }} />
        ) : (
          <IoSend />
        )}
      </IconButton>
    </Box>
  )
}

export default MessageInput
