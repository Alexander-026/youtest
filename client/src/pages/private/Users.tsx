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
  Modal,
  Stack,
  Box,
} from "@mui/material"
import {
  useFriendRequestMutation,
  useCancelFriendshipMutation,
  useGetUsersQuery,
  useAcceptFriendshipMutation,
} from "../../app/api/usersApiSlice"
import LoaderWrapper from "../../components/LoaderWrapper"
import MyAvatar from "../../components/MyAvatar"
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  cancelFriendshipAction,
  acceptFriendshipAction,
} from "../../features/user/userSlice"
import type { Notification } from "../../types/user"

type ModalType = "friendRequest" | "acceptRequest" | "cancelRequest"

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

const Users = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const { data: users, isLoading, isError, error, refetch } = useGetUsersQuery()
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [newNotification, setNewNotification] = useState<
    Notification | undefined
  >(undefined)
  const [showModal, setShowModal] = useState<ModalType | null>(null)
  const [
    friendRequest,
    { data: result, error: friendError, isLoading: friendLoading },
  ] = useFriendRequestMutation()

  const [acceptFriendship, { isError: acceptError, data: acceptData }] =
    useAcceptFriendshipMutation()

  const [
    cancelRequest,
    { data: cancelData, error: cacelError, isLoading: cancelLoading },
  ] = useCancelFriendshipMutation()

  if (error) {
    console.log((error as any).data.message)
  }

  const handleClose = () => {
    setLoadingUserId(null)
    setShowModal(null)
    setNewNotification(undefined)
  }

  const handleFriendRequest = (
    otherUserId: string,
    notification?: Notification,
  ) => {
    if (notification) {
      console.log("notification", notification)
      dispatch(acceptFriendshipAction({ sender: notification }))
      acceptFriendship({
        myUserId: user!.id,
        senderUserId: otherUserId,
      }).finally(() => handleClose())
    } else {
      friendRequest({
        myUserId: user!.id,
        senderUserId: otherUserId,
      }).finally(() => handleClose())
    }
  }

  const handleCancelRequest = (
    otherUserId: string,
    notification?: Notification,
  ) => {
    if (notification) {
      dispatch(cancelFriendshipAction(notification.userId))
      cancelRequest({
        myUserId: user!.id,
        senderUserId: otherUserId,
      }).finally(() => handleClose())
    } else {
      cancelRequest({
        myUserId: user!.id,
        senderUserId: otherUserId,
      }).finally(() => handleClose())
    }
  }

  useEffect(() => {
    refetch()
  }, [user?.notifications])

  return (
    <LoaderWrapper loading={isLoading} data={users}>
      <Modal
        onClose={handleClose}
        open={!!showModal}
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
            {showModal === "friendRequest" &&
              "Are you sure you want to send a friend request?"}
            {showModal === "acceptRequest" &&
              "Are you sure you want to accept a friend request?"}
            {showModal === "cancelRequest" &&
              "Are you sure you want to cancel the friendship?"}
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
                if (showModal === "friendRequest") {
                  console.log("idUserr sender", loadingUserId)
                  loadingUserId && handleFriendRequest(loadingUserId)
                } else if (showModal === "cancelRequest") {
                  console.log("idUserr sender", loadingUserId)
                  loadingUserId &&
                    handleCancelRequest(loadingUserId, newNotification)
                } else if (showModal === "acceptRequest") {
                  console.log("idUserr sender", loadingUserId)
                  loadingUserId &&
                    handleFriendRequest(loadingUserId, newNotification)
                }
              }}
              color="success"
            >
              Yes
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography align="center" variant="h4">
        Users
      </Typography>
      {isError && <Alert severity="error">{(error as any).data.message}</Alert>}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {users?.map(otherUser => {
          const requestSent = !!otherUser.notifications.find(
            f => f.userId === user!.id && f.contact,
          )
          const alreadyFriend = !!otherUser.friends.find(
            f => f.userId === user!.id,
          )

          const notification = user?.notifications.find(
            n => n.userId === otherUser.id && n.contact,
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
                {notification ? (
                  <Stack>
                    <Typography>{notification.message}</Typography>
                    <Stack
                      flexDirection="row"
                      alignItems="center"
                      gap={2}
                      justifyContent="space-between"
                    >
                      <Button
                        onClick={() => {
                          setLoadingUserId(notification.userId)
                          setNewNotification(notification)
                          setShowModal("cancelRequest")
                        }}
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setLoadingUserId(notification.userId)
                          setNewNotification(notification)
                          setShowModal("acceptRequest")
                        }}
                        size="small"
                        variant="outlined"
                        color="success"
                      >
                        Accept
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    {(requestSent || alreadyFriend) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          alreadyFriend
                            ? "error"
                            : requestSent
                              ? "secondary"
                              : "error"
                        }
                        onClick={() => {
                          setLoadingUserId(otherUser.id)
                          setShowModal("cancelRequest")
                        }}
                        disabled={loadingUserId === otherUser.id}
                        startIcon={
                          loadingUserId === otherUser.id && (
                            <CircularProgress size={25} />
                          )
                        }
                      >
                        {alreadyFriend && "Delete From Friends"}
                        {requestSent && "Under review"}
                      </Button>
                    )}

                    {!requestSent && !alreadyFriend && (
                      <Button
                        disabled={
                          requestSent ||
                          alreadyFriend ||
                          loadingUserId === otherUser.id
                        }
                        onClick={() => {
                          setLoadingUserId(otherUser.id)
                          setShowModal("friendRequest")
                        }}
                        size="small"
                        variant="outlined"
                        startIcon={
                          loadingUserId === otherUser.id && (
                            <CircularProgress size={25} />
                          )
                        }
                      >
                        Set contact
                      </Button>
                    )}
                  </>
                )}
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
