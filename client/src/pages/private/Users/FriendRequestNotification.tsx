import { CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import type React from "react"
import { FaCheck } from "react-icons/fa"
import { GiThink } from "react-icons/gi"
import { IoIosPersonAdd } from "react-icons/io"
import { IoPersonRemove } from "react-icons/io5"
import { MdOutlineCancel } from "react-icons/md"
import { MdPersonRemove } from "react-icons/md";
import type { DecodedUser, Notification } from "../../../types/user"
import type { ModalType } from "./Users"


type FriendRequestNotificationType = {
    notification: Notification | undefined
    requestSent: boolean
    alreadyFriend: boolean,
    otherUser: DecodedUser
    loadingUserId: string | null
    setLoadingUserId: (userId: string) => void
    setNewNotification: (notification: Notification) => void
    setShowModal: (modalType: ModalType | null) => void
}

const FriendRequestNotification:React.FC<FriendRequestNotificationType> = ({
    notification,
    setLoadingUserId,
    setNewNotification,
    setShowModal,
    requestSent,
    alreadyFriend,
    otherUser,
    loadingUserId
}) => {
  return (
    <>
      {notification ? (
        <Stack>
          <Typography sx={{ fontSize: { md: "12px", xs: "9px" } }}>
            {notification.message}
          </Typography>
          <Stack
            flexDirection="row"
            alignItems="center"
            gap={2}
            justifyContent="space-between"
          >
            <IconButton
              onClick={() => {
                setLoadingUserId(notification.userId)
                setNewNotification(notification)
                setShowModal("cancelRequest")
              }}
              size="small"
              color="error"
            >
              <MdOutlineCancel />
            </IconButton>
            <IconButton
              onClick={() => {
                setLoadingUserId(notification.userId)
                setNewNotification(notification)
                setShowModal("acceptRequest")
              }}
              size="small"
              color="success"
            >
              <FaCheck />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        <>
          {(requestSent || alreadyFriend) && (
            <IconButton
              size="small"
              color={
                alreadyFriend ? "error" : requestSent ? "secondary" : "error"
              }
              onClick={() => {
                setLoadingUserId(otherUser.id)
                setShowModal("cancelRequest")
              }}
              disabled={loadingUserId === otherUser.id}
            >
              {loadingUserId === otherUser.id ? (
                <CircularProgress size={25} />
              ) : (
                <>
                  {alreadyFriend && <MdPersonRemove size={25} color="red" />}
                  {requestSent && <GiThink size={25} />}
                </>
              )}
            </IconButton>
          )}

          {!requestSent && !alreadyFriend && (
            <IconButton
              disabled={
                requestSent || alreadyFriend || loadingUserId === otherUser.id
              }
              onClick={() => {
                setLoadingUserId(otherUser.id)
                setShowModal("friendRequest")
              }}
              size="small"
              color="success"
            >
              {loadingUserId === otherUser.id ? (
                <CircularProgress size={25} />
              ) : (
                <IoIosPersonAdd  size={25} />
              )}
            </IconButton>
          )}
        </>
      )}
    </>
  )
}

export default FriendRequestNotification
