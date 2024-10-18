import React, { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material"
import Drawer from "@mui/joy/Drawer"

import { IoMdNotificationsOutline } from "react-icons/io"
import {
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useDeleteNotificationMutation,
} from "../app/api/usersApiSlice"
import MyAvatar from "./MyAvatar"
import { FcCancel } from "react-icons/fc"
import { FaCheck } from "react-icons/fa6"
import { CiSquareRemove } from "react-icons/ci"
import {
  acceptFriendshipAction,
  cancelFriendshipAction,
  addNewFriendRequestAction,
  removeNotificationAction,
} from "../features/user/userSlice"
import dayjs from "dayjs"
import { useSocketContext } from "../context/socketContext"
import type { Notification } from "../types/user"

const Notifications = () => {
  const { user } = useAppSelector(state => state.user)
  const { socket } = useSocketContext()
  // const { addNewFriendRequest, removeNotification } = userSlice.actions
  const dispatch = useAppDispatch()
  const [acceptFriendship, { isError: acceptError, data: acceptData }] =
    useAcceptFriendshipMutation()
  const [cancelFriendship, { isError: cancelError }] =
    useCancelFriendshipMutation()
  const [deleteNotification, { isError: deleteNotificationError }] =
    useDeleteNotificationMutation()
  const [open, setOpen] = useState<boolean>(false)

  const handlerNewRegs = useCallback(() => {
    socket?.on("newFriendRequest", (result: Notification) => {
      dispatch(addNewFriendRequestAction(result))

    })
    socket?.on("acceptFriendship", (result: Notification) => {
      dispatch(acceptFriendshipAction({ sender: result}))
      dispatch(addNewFriendRequestAction(result))
    })
    socket?.on("cancelFriendship", (result: Notification) => {
      dispatch(cancelFriendshipAction(result.userId))
      dispatch(addNewFriendRequestAction(result))
    })

    // Очищаем обработчик при размонтировании компонента
    return () => {
      socket?.off("newFriendRequest")
      socket?.off("acceptFriendship")
      socket?.off("cancelFriendship")
    }
  }, [socket])

  // Вызываем обработчик событий сокета
  useEffect(() => {
    const unsubscribe = handlerNewRegs()

    return () => {
      unsubscribe() // Отписка от события при размонтировании
    }
  }, [handlerNewRegs])

  return (
    <>
      {user && (
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disabled={user ? !user.notifications.length : false}
            onClick={() => setOpen(true)}
            size="small"
            color="inherit"
          >
            <Badge
              badgeContent={user ? user.notifications.length : 0}
              color="success"
            >
              <IoMdNotificationsOutline color="white" fontSize={25} />
            </Badge>
          </IconButton>

          <Drawer
            color="neutral"
            invertedColors
            size="sm"
            variant="soft"
            component="aside"
            anchor={"right"}
            open={open}
            onClose={() => setOpen(false)}
          >
            <List>
              {user.notifications.map(n => {
                const fullName = n.label.split(" ")

                return (
                  <Box
                    sx={{
                      position: "relative",
                    }}
                    key={n._id}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <MyAvatar
                          user={{
                            image: n.image,
                            firstName: fullName[0],
                            lastName: fullName[1],
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={n.label}
                        secondary={<Typography>{n.message}</Typography>}
                      />
                    </ListItem>
                    <Typography
                      padding="0 1rem"
                      textAlign="end"
                    >{`${dayjs(n.requestDate).format("DD.MM.YYYY HH:mm:ss")}`}</Typography>

                    {n.contact ? (
                      <Stack
                        justifyContent="center"
                        gap={2}
                        flexDirection={"row"}
                        mb={1}
                      >
                        <Button
                          onClick={() => {
                            if (user.notifications.length === 1) {
                              setOpen(false)
                            }

                            dispatch(acceptFriendshipAction({ sender: n }))
                            acceptFriendship({
                              myUserId: user.id,
                              senderUserId: n.userId,
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
                            if (user.notifications.length === 1) {
                              setOpen(false)
                            }

                            dispatch(cancelFriendshipAction(n.userId))
                            cancelFriendship({
                              myUserId: user.id,
                              senderUserId: n.userId,
                            })
                          }}
                          size="small"
                          variant="outlined"
                          color="error"
                        >
                          <FcCancel />
                        </Button>
                      </Stack>
                    ) : (
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: "0.2rem",
                          right: "0.2rem",
                        }}
                        onClick={() => {
                          if (user.notifications.length === 1) {
                            setOpen(false)
                          }
                          dispatch(removeNotificationAction(n._id))
                          deleteNotification({
                            myUserId: user.id,
                            notificationId: n._id,
                          })
                        }}
                      >
                        <CiSquareRemove />
                      </IconButton>
                    )}
                    <Divider variant="fullWidth" component="div" />
                  </Box>
                )
              })}
            </List>
          </Drawer>
        </>
      )}
    </>
  )
}

export default Notifications
