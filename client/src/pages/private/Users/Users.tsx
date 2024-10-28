import {
  Alert,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import { useGetUsersQuery } from "../../../app/api/usersApiSlice"
import LoaderWrapper from "../../../components/LoaderWrapper"
import MyAvatar from "../../../components/MyAvatar"
import React, { useEffect, useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import type { DecodedUser, Notification } from "../../../types/user"
import UsersModal from "./UsersModal"
import FriendRequestNotification from "./FriendRequestNotification"
import { AiFillMessage } from "react-icons/ai";
import MessageInputModal from "../../../components/MessageInputModal"

export type ModalType = "friendRequest" | "acceptRequest" | "cancelRequest"

const Users = () => {
  const { user } = useAppSelector(state => state.user)

  const { data: users, isLoading, isError, error, refetch } = useGetUsersQuery()
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [newNotification, setNewNotification] = useState<
    Notification | undefined
  >(undefined)
  const [showModal, setShowModal] = useState<ModalType | null>(null)
  const [showMessageModal, setShowMessageModal] = useState<DecodedUser | null>(null)

  if (error) {
    console.log((error as any).data.message)
  }

  const handleClose = () => {
    setLoadingUserId(null)
    setShowModal(null)
    setNewNotification(undefined)
  }

  useEffect(() => {
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.notifications])

  return (
    <LoaderWrapper loading={isLoading} data={users}>
      <MessageInputModal receiver={showMessageModal} handleClose={() => setShowMessageModal(null)}/>
      <UsersModal
        handleClose={handleClose}
        showModal={showModal}
        loadingUserId={loadingUserId}
        newNotification={newNotification}
      />
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
                <IconButton onClick={() => setShowMessageModal(otherUser)} color="primary">
                  <AiFillMessage/>
                </IconButton>
                <FriendRequestNotification
                  notification={notification}
                  requestSent={requestSent}
                  alreadyFriend={alreadyFriend}
                  otherUser={otherUser}
                  loadingUserId={loadingUserId}
                  setLoadingUserId={(userId: string) =>
                    setLoadingUserId(userId)
                  }
                  setNewNotification={(notification: Notification) =>
                    setNewNotification(notification)
                  }
                  setShowModal={(modalType: ModalType | null) =>
                    setShowModal(modalType)
                  }
                />
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
