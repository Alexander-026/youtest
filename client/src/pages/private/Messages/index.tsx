import { Box, Stack } from "@mui/material"
import ListChat from "./ListChat"
import { useState } from "react"
import MessageField from "./MessageField"

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<string>("")

  return (
    <Stack flexDirection="row" sx={{ height: "100%" }}>
      <ListChat
        selectedChat={selectedChat}
        onChat={id => setSelectedChat(id)}
      />
      <MessageField conversationId={selectedChat} />
    </Stack>
  )
}

export default MessagesPage
