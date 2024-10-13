import {
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material"
import {
  useFriendRequestMutation,
  useCancelFriendshipMutation,
  useGetUsersQuery,
} from "../../app/api/usersApiSlice"
import LoaderWrapper from "../../components/LoaderWrapper"
import MyAvatar from "../../components/MyAvatar"
import React, { useState } from "react"
import { useAppSelector } from "../../app/hooks"

const Users = () => {
  const { user } = useAppSelector(state => state.user)
  const { data: users, isLoading, isError, error } = useGetUsersQuery()
   // Состояние для отслеживания текущего загружаемого пользователя
   const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [
    friendRequest,
    { data: result, error: friendError, isLoading: friendLoading },
  ] = useFriendRequestMutation()

  const [
    cancelRequest,
    { data: cancelData, error: cacelError, isLoading: cancelLoading },
  ] = useCancelFriendshipMutation()

  if (error) {
    console.log((error as any).data.message)
  }

  const handleFriendRequest = (otherUserId: string) => {
    setLoadingUserId(otherUserId)
    friendRequest({
      myUserId: user!.id,
      senderUserId: otherUserId,
    }).finally(() => setLoadingUserId(null))
  }

  const handleCancelRequest = (otherUserId: string) => {
    setLoadingUserId(otherUserId)
    cancelRequest({
      myUserId: user!.id,
      senderUserId: otherUserId,
    }).finally(() => setLoadingUserId(null))
  }

  return (
    <LoaderWrapper loading={isLoading} data={users}>
      <Typography align="center" variant="h4">
        Users
      </Typography>
      {isError && <Alert severity="error">{(error as any).data.message}</Alert>}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {users?.map(otherUser => {
          const requestSent = !!otherUser.friendRequests.find(
            f => f.userId === user!.id,
          )
          const alreadyFriend = !!otherUser.friends.find(
            f => f.userId === user!.id,
          )

        
          return (
            <React.Fragment key={otherUser.id}>
              <ListItem>
                <ListItemAvatar>
                  <MyAvatar user={otherUser} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${otherUser.firstName} ${otherUser.lastName}`}
                  secondary={<Typography>{otherUser.birthDate}</Typography>}
                />
                <Tooltip
                  title={
                    alreadyFriend
                      ? "Delete From Friends"
                      : !requestSent && !alreadyFriend
                        ? "Add to friends"
                        : ""
                  }
                >
                  <span>
                    <Button
                      disabled={requestSent || alreadyFriend || loadingUserId === otherUser.id}
                      onClick={() => {
                        if (!requestSent && !alreadyFriend) {
                          handleFriendRequest(otherUser.id)
                        } else if (!requestSent && alreadyFriend) {
                          handleCancelRequest(otherUser.id)
                        }
                      }}
                      size="small"
                      variant="outlined"
                      startIcon={loadingUserId === otherUser.id && <CircularProgress size={25} />}
                    >
                      {requestSent && !alreadyFriend
                        ? "Sent"
                        : !requestSent && alreadyFriend
                          ? "Already friends"
                          : "Send friendship"}
                    </Button>
                  </span>
                </Tooltip>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          )
        })}
      </List>
    </LoaderWrapper>
  )
}

export default Users
