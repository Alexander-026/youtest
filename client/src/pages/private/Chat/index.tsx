import { Stack } from "@mui/material"
import ListChat from "./ListChat"
import ChatField from "./ChatField"
const MessagesPage = () => {
  return (
    <Stack flexDirection="row" gap={{md: 2, xs: 0}} sx={{  height: "100%" }}>
      <ListChat />
      <ChatField/>
    </Stack>
  )
}

export default MessagesPage
