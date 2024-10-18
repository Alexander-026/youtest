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
  Modal,
  Stack,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  useCancelFriendshipMutation,
  useGetUsersByIdMutation,
} from "../../app/api/usersApiSlice"
import React, { useEffect, useState } from "react"
import LoaderWrapper from "../../components/LoaderWrapper"
import MyAvatar from "../../components/MyAvatar"
import dayjs, { Dayjs } from "dayjs"
import { cancelFriendshipAction } from "../../features/user/userSlice"
import { IoPersonRemoveSharp } from "react-icons/io5";

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

const FriendsPage = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [getUsersById, { data: users, isError, isLoading }] =
    useGetUsersByIdMutation()
  const [cancelFriendship, { isError: cancelError, isLoading: cancelLoading }] =
    useCancelFriendshipMutation()
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  


  const handleClose = () => {
    setLoadingUserId(null)

  }
  useEffect(() => {
    if (user) {
      const frendIds = user.friends.map(r => r.userId)

      getUsersById({ userIds: frendIds })

      console.log("userIds", frendIds)
    }
  }, [getUsersById, user])
  return (
    <LoaderWrapper loading={isLoading} data={users}>
       <Modal
        onClose={handleClose}
        open={!!loadingUserId}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            mb={"2rem"}
          >
             Are you sure you want to cancel the friendship?
          </Typography>

          <Stack
            flexDirection="row"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button variant="contained" onClick={handleClose} color="error">
              No
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if(loadingUserId) {
                  dispatch(cancelFriendshipAction(loadingUserId))
                  cancelFriendship({
                    myUserId: user!.id,
                    senderUserId: loadingUserId,
                  }).finally(() => handleClose())
                }
               
              }}
              color="success"
            >
              Yes
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography textAlign="center" variant="h4">
        Friends
      </Typography>

      {users && users.length < 1 && (
        <Typography variant="h6">You don't have any friends</Typography>
      )}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {users?.map(otherUser => {
          const sender = user?.friends.find(f => f.userId === otherUser.id)
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
                    setLoadingUserId(otherUser.id)
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
