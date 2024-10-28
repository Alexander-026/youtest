import { useState } from "react"
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material"
import Drawer from "@mui/joy/Drawer"
import { FaUser } from "react-icons/fa"
import { IoSettingsSharp } from "react-icons/io5"
import { RiLogoutBoxFill } from "react-icons/ri"

import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import MyAvatar from "./MyAvatar"
import { useLogoutMutation } from "../app/api/usersApiSlice"
import { userSlice } from "../features/user/userSlice"
import useLocalStorage from "../hooks/useLocalStorage"
import { apiSlice } from "../app/api/apiSlice"
import type { Pages } from "../types/pages"
import DriwerItem from "./DriwerItem"

const pages: Pages[] = [
  {
    path: "/profile",
    icon: <FaUser size={20} />,
    label: "Profile",
    isAdmin: false,
  },
  {
    path: "/settings",
    icon: <IoSettingsSharp size={20} />,
    label: "Settings",
    isAdmin: false,
  },
]

const AccountMenu = () => {
  const { user } = useAppSelector(state => state.user)
  const [, , removeToken] = useLocalStorage("accessToken")
  const [, , removeRefreshToken] = useLocalStorage("refreshToken")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { logOut } = userSlice.actions
  const [logoutApiCall] = useLogoutMutation()
  const [open, setOpen] = useState<boolean>(false)
  const logoutHandler = async () => {
    try {
      await logoutApiCall()
      dispatch(logOut())
      dispatch(apiSlice.util.resetApiState())
      removeToken()
      removeRefreshToken()
      navigate("/", { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {user && (
        <>
          <Tooltip title="Login&Register">
            <Button
              id="basic-button"
              onClick={() => setOpen(true)}
              color="inherit"
              sx={{padding: 0}}
              
            >
              <MyAvatar user={user} />
            </Button>
          </Tooltip>
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
            <List
              onClick={() => setOpen(false)}
              onKeyDown={() => setOpen(false)}
            >
              {pages.map(p => (
                <DriwerItem key={p.path} page={p} />
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    logoutHandler()
                  }}
                >
                  <ListItemIcon>
                    <RiLogoutBoxFill size={20} />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </>
      )}
    </>
  )
}

export default AccountMenu
