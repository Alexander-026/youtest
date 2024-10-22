import {
  Backdrop,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import type React from "react"
import { useGetConvarsationsQuery } from "../../../app/api/messagesApiSlice"
import MyAvatar from "../../../components/MyAvatar"
import timeSinceLastOnline from "../../../utils/timeSinceLastOnline"
import { useAppSelector } from "../../../app/hooks"
import { useEffect } from "react"

type ListChatProps = {
  selectedChat: string
  onChat: (id: string) => void
}

const ListChat: React.FC<ListChatProps> = ({ selectedChat, onChat }) => {
  const { onlineUsers } = useAppSelector(state => state.user)
  const { data, isError, isLoading, refetch } = useGetConvarsationsQuery()

  useEffect(() => {
    refetch()
  }, [onlineUsers])

  return (
    <Box
      sx={{
        width: {
          xs: "8rem",
          md: "20rem",
        },
        backgroundColor: "#424242",
      }}
      component="aside"
      position="relative"
    >
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
        <List sx={{ width: "100%", padding: 0 }}>
          {data.map(s => {
            const participant = s.participant
            const isOnline = onlineUsers.find(
              onlineU => onlineU.id === participant.id,
            )
            return (
              <ListItem
                sx={{
                  backgroundColor:
                    selectedChat === s.id ? "#3949ab" : "transparent",
                }}
                disablePadding
                key={s.id}
              >
                <ListItemButton onClick={() => onChat(s.id)}>
                  <ListItemAvatar>
                    <MyAvatar
                      user={{
                        firstName: participant.firstName,
                        lastName: participant.lastName,
                        image: participant.image,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ color: "#FFFFFF" }}
                    primary={`${participant.firstName} ${participant.lastName}`}
                    secondary={
                      <Typography color={isOnline ? "green" : ""}>
                        {isOnline
                          ? "Online"
                          : timeSinceLastOnline(participant.wasOnline)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      )}
    </Box>
  )
}

export default ListChat
