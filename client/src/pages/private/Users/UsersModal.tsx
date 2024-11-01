import { Box, Button, Modal, Stack, Typography } from "@mui/material"
import type React from "react"
import type { ModalType } from "./Users"
import type { Notification } from "../../../types/user"
import {
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useFriendRequestMutation,
} from "../../../app/api/usersApiSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { acceptFriendshipAction, cancelFriendshipAction } from "../../../features/user/userSlice"
import modalStyle from "../../../utils/modalSyle"



type UsersModalType = {
  handleClose: () => void
  showModal: ModalType | null
  loadingUserId: string | null
  newNotification: Notification | undefined
}
const UsersModal: React.FC<UsersModalType> = ({
  handleClose,

  showModal,
  loadingUserId,
  newNotification,
}) => {
const { user } = useAppSelector(state => state.user)
const dispatch = useAppDispatch()
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

  const handleFriendRequest = (
    otherUserId: string,
    notification?: Notification,
  ) => {
    if (notification) {
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

  return (
    <Modal
      onClose={handleClose}
      open={!!showModal}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={modalStyle}>
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
  )
}

export default UsersModal
