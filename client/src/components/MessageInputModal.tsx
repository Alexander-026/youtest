import {
  Box,
  CircularProgress,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material"
import type React from "react"
import { useSendMessageMutation } from "../app/api/messagesApiSlice"
import { useAppDispatch } from "../app/hooks"
import { useCallback, useState } from "react"
import type { DecodedUser } from "../types/user"
import { IoSend } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}

type MessageInputModalType = {
  receiver: DecodedUser | null
  handleClose: () => void
}

const MessageInputModal: React.FC<MessageInputModalType> = ({
  handleClose,
  receiver,
}) => {
  const navigate = useNavigate()
  const [send, { isError, isLoading }] = useSendMessageMutation()
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState("")

  const handlerSendMessage = useCallback(
    async (newMessage: string) => {
      if (receiver) {
        setMessage("")
        const data = await send({
          receiverId: receiver.id,
          message: newMessage,
        }).unwrap()

        navigate("/messages", { replace: true })

        // dispatch(setMessageAction(data))
      }
    },
    [navigate, receiver, send],
  )

  const isValid = (mes: string): boolean => {
    return mes.trim().length > 0
  }
  return (
    <Modal
      aria-labelledby="modal-modal-title"
      onClose={handleClose}
      open={!!receiver}
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
          mb={"2rem"}
        >
          New Message
        </Typography>
        <TextField
          multiline
          minRows={5}
          maxRows={10}
          fullWidth
          placeholder="Write a message"
          sx={{ padding: "1rem" }}
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={isLoading}
          variant="outlined"
        />
        <IconButton
          disabled={!isValid(message) || isLoading}
          onClick={() => handlerSendMessage(message)}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "#3949a" }} />
          ) : (
            <IoSend />
          )}
        </IconButton>
      </Box>
    </Modal>
  )
}

export default MessageInputModal
