import React from "react"
import { Button, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material"
import { FaUser } from "react-icons/fa"
import { IoSettingsSharp } from "react-icons/io5"
import { RiLogoutBoxFill } from "react-icons/ri"

import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import MyAvatar from "./MyAvatar"
import { useLogoutMutation } from "../app/api/usersApiSlice"
import { userSlice } from "../features/user/userSlice"
import useLocalStorage from "../hooks/useLocalStorage"

const AccountMenu = () => {
  const { user } = useAppSelector(state => state.user)
  const [, , removeToken] = useLocalStorage("accessToken")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { logOut } = userSlice.actions
  const [logoutApiCall] = useLogoutMutation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logoutHandler = async () => {
    try {
      dispatch(logOut())
      removeToken()
      navigate("/", { replace: true })
      await logoutApiCall()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {user && (
        <div>
          <Tooltip title="Login&Register">
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              color="inherit"
            >
              <MyAvatar user={user} />
            </Button>
          </Tooltip>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link to="/profile">
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <FaUser size={20} />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>
            <Link to="/settings">
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <IoSettingsSharp size={20} />
                </ListItemIcon>
                Settings
              </MenuItem>
            </Link>
            <MenuItem
              onClick={() => {
                handleClose()
                logoutHandler()
              }}
            >
              <ListItemIcon>
                <RiLogoutBoxFill size={20} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      )}
    </>
  )
}

export default AccountMenu
