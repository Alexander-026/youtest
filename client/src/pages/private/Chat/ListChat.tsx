import {
  Backdrop,
  Badge,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import { useGetConvarsationsQuery } from "../../../app/api/messagesApiSlice"
import MyAvatar from "../../../components/MyAvatar"
import timeSinceLastOnline from "../../../utils/timeSinceLastOnline"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { memo, useEffect } from "react"
import {
  selectConversationAction,
  leaveConversationACtion,
} from "../../../features/chat/chatSlice"
import { useLocation } from "react-router-dom"

const ListChat = () => {
  const { selectedConversationId, unreadMessages } = useAppSelector(
    state => state.chat,
  )
  const { onlineUsers } = useAppSelector(state => state.user)

  const dispatch = useAppDispatch()
  const { data, isError, isLoading, refetch } = useGetConvarsationsQuery()

  const location = useLocation()

  useEffect(() => {
    refetch()
  }, [onlineUsers, refetch])

  useEffect(() => {
    return () => {
      dispatch(leaveConversationACtion())
    }
  }, [dispatch, location.pathname])

  return (
    <Box
      sx={{
        width: {
          xs: "5rem",
          md: "20rem",
        },
        backgroundColor: "#424242",
        borderRadius: { md: "10px", xs: 0 },
        overflow: "hidden",
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
          {data.map(conversation => {
            const participant = conversation.participant
            const isOnline = onlineUsers.find(
              onlineU => onlineU.id === participant.id,
            )
            const unreadCount = unreadMessages.find(
              um =>
                um.conversationId === conversation.id &&
                conversation.id !== selectedConversationId,
            )?.count
            return (
              <ListItem
                sx={{
                  backgroundColor:
                    selectedConversationId === conversation.id
                      ? "#193c47"
                      : "transparent",
                  position: "relative",
                }}
                disablePadding
                key={conversation.id}
              >
                <Badge
                  sx={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}
                  badgeContent={unreadCount || 0}
                  color="success"
                />
                <ListItemButton
                  onClick={() =>
                    dispatch(selectConversationAction(conversation.id))
                  }
                  sx={{
                    flexDirection: { md: "row", xs: "column" },
                    px: { md: "0.5rem", xs: 0 },
                  }}
                >
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
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
                    primary={
                      <Typography
                        sx={{
                          pr: { md: "1rem", xs: 0 },
                          fontSize: { md: "12px", xs: "8px" },
                          textAlign: { md: "left", xs: "center" },
                        }}
                      >
                        {participant.firstName} {participant.lastName}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          pr: { md: "1rem", xs: 0 },
                          fontSize: { md: "12px", xs: "8px" },
                          textAlign: { md: "left", xs: "center" },
                        }}
                        color={isOnline ? "green" : ""}
                      >
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

export default memo(ListChat)
