import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  useCancelFriendshipMutation,
  useGetUsersByIdMutation,
} from "../../app/api/usersApiSlice"
import React, { useEffect } from "react"
import LoaderWrapper from "../../components/LoaderWrapper"
import MyAvatar from "../../components/MyAvatar"
import dayjs, { Dayjs } from "dayjs"
import { cancelFriendshipAction } from "../../features/user/userSlice"
import { IoPersonRemoveSharp } from "react-icons/io5";

const FriendsPage = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [getUsersById, { data: users, isError, isLoading }] =
    useGetUsersByIdMutation()
  const [cancelFriendship, { isError: cancelError, isLoading: cancelLoading }] =
    useCancelFriendshipMutation()

  useEffect(() => {
    if (user) {
      const frendIds = user.friends.map(r => r.userId)

      getUsersById({ userIds: frendIds })

      console.log("userIds", frendIds)
    }
  }, [getUsersById, user])
  return (
    <LoaderWrapper loading={isLoading} data={users}>
      <Typography textAlign="center" variant="h4">
        Friends
      </Typography>

      {users && users.length < 1 && (
        <Typography variant="h6">You don't have any friends</Typography>
      )}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {users?.map(otherUser => {
          const sender = user?.friends.find(f => f.userId === otherUser.id)

          //   const allreadyFriend = !!otherUser.friends.find(
          //     f => f.userId === user!.id,
          //   )
          return (
            <React.Fragment key={otherUser.id}>
              <ListItem>
                <ListItemAvatar>
                  <MyAvatar user={otherUser} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${otherUser.firstName} ${otherUser.lastName}`}
                  secondary={
                    <Typography>{`${sender && dayjs(sender.requestDate).format("DD.MM.YYYY HH:mm:ss")}`}</Typography>
                  }
                />
                <Tooltip title="Remove from friends">
                  <span>
                  <IconButton
                  disabled={cancelLoading}
                  onClick={() => {
                    sender && dispatch(cancelFriendshipAction({ sender }))
                    cancelFriendship({
                      myUserId: user!.id,
                      senderUserId: otherUser.id,
                    })
                  }}
                  size="small"
                >
                 { cancelLoading ? <CircularProgress size={25} /> :  <IoPersonRemoveSharp/>}
                </IconButton>
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

export default FriendsPage
