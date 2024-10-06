import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  Badge,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  Button,
  Stack,
} from "@mui/material"

import { IoMdNotificationsOutline } from "react-icons/io"
import {
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useGetUsersByIdMutation,
} from "../app/api/usersApiSlice"
import MyAvatar from "./MyAvatar"
import { FcCancel } from "react-icons/fc"
import { FaCheck } from "react-icons/fa6"
import {
  acceptFriendshipAction,
  cancelFriendshipAction,
  userSlice,
} from "../features/user/userSlice"
import dayjs from "dayjs"

const Notifications = () => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [getUsersById, { data, isError, isLoading }] = useGetUsersByIdMutation()
  const [acceptFriendsh, { isError: acceptError, data: acceptData }] =
    useAcceptFriendshipMutation()
  const [cancelFriendship, { isError: cancelError }] =
    useCancelFriendshipMutation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (user) {
      const userIds = user.friendRequests.map(r => r.userId)

      getUsersById({ userIds })

      console.log("userIds", userIds)
    }
  }, [getUsersById, user])

  return (
    <>
      {user && (
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disabled={!data?.length}
            onClick={handleClick}
            size="small"
            color="inherit"
          >
            <Badge
              badgeContent={data ? user.friendRequests.length : 0}
              color="success"
            >
              <IoMdNotificationsOutline color="white" fontSize={25} />
            </Badge>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <List>
              {data?.map(otherUser => {
                const sender = user.friendRequests.find(
                  u => u.userId === otherUser.id,
                )

                return (
                  <React.Fragment key={otherUser.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <MyAvatar user={otherUser} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${otherUser.firstName} ${otherUser.lastName}`}
                        secondary={
                          <Typography>Wants to be friends with you</Typography>
                        }
                      />
                    </ListItem>
                    {sender && (
                      <Typography textAlign="center">{`${dayjs(sender.requestDate).format("DD.MM.YYYY HH:mm:ss")}`}</Typography>
                    )}

                    <Stack
                      justifyContent="center"
                      gap={2}
                      flexDirection={"row"}
                      mb={1}
                    >
                      <Button
                        onClick={() => {
                          if (user.friendRequests.length === 1) {
                            setAnchorEl(null)
                          }
                          sender && dispatch(acceptFriendshipAction({ sender }))
                          acceptFriendsh({
                            myUserId: user.id,
                            senderUserId: otherUser.id,
                          })
                        }}
                        size="small"
                        variant="contained"
                        color="success"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        onClick={() => {
                          if (user.friendRequests.length === 1) {
                            setAnchorEl(null)
                          }
                          sender && dispatch(cancelFriendshipAction({ sender }))
                          cancelFriendship({
                            myUserId: user.id,
                            senderUserId: otherUser.id,
                          })
                        }}
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        <FcCancel />
                      </Button>
                    </Stack>
                    <Divider variant="fullWidth" component="div" />
                  </React.Fragment>
                )
              })}
            </List>
          </Menu>
        </>
      )}
    </>
  )
}

export default Notifications
