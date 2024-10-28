import { Box, Typography } from "@mui/material"
import type React from "react"
import type { Conversation } from "../../../types/messages"

type HeaderChatType = {
  data: Conversation
}

const HeaderChat: React.FC<HeaderChatType> = ({ data }) => {
  return (
    <Box
      bgcolor={"#424242"}
      borderLeft={1}
      borderColor={"#212121"}
      height={"4rem"}
      sx={{ display: "flex", alignItems: "center", padding: "0 1rem" }}
    >
      <Typography color="#FFFFFF">
        {data.participant.firstName} {data.participant.lastName}
      </Typography>
    </Box>
  )
}

export default HeaderChat
