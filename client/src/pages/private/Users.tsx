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
import React from "react"
import { useAppSelector } from "../../app/hooks"

const Users = () => {
  const { user } = useAppSelector(state => state.user)
  const { data: users, isLoading, isError, error } = useGetUsersQuery()
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

  const loading = isLoading || friendLoading

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
          const allreadyFriend = !!otherUser.friends.find(
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
                    allreadyFriend
                      ? "Delete From Friends"
                      : !requestSent && !allreadyFriend
                        ? "Add to friends"
                        : ""
                  }
                >
                  <span>
                    <Button
                      disabled={requestSent || allreadyFriend || loading}
                      onClick={() => {
                        if (!requestSent && !allreadyFriend) {
                          friendRequest({
                            myUserId: user!.id,
                            senderUserId: otherUser.id,
                          })
                        }

                        if (!requestSent && allreadyFriend) {
                          cancelRequest({
                            myUserId: user!.id,
                            senderUserId: otherUser.id,
                          })
                        }
                      }}
                      size="small"
                      variant="outlined"
                      startIcon={loading && <CircularProgress size={25} />}
                    >
                      {requestSent && !allreadyFriend
                        ? "Under consideration"
                        : !requestSent && allreadyFriend
                          ? "Already friends"
                          : "Make contact"}
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
