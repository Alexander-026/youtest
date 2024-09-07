import React from "react"
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material"
import { IoMdLogIn } from "react-icons/io"
import { RiLoginBoxFill } from "react-icons/ri"
import { FaUserCheck } from "react-icons/fa"
import type { Pages } from "../types/pages"

import { Link, useLocation } from "react-router-dom"

const pages: Pages[] = [
  {
    path: "/login",
    icon: <RiLoginBoxFill size={20} />,
    label: "Login",
    isAdmin: false,
  },
  {
    path: "/register",
    icon: <FaUserCheck size={20} />,
    label: "Register",
    isAdmin: false,
  },
]

const AuthMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { pathname } = useLocation()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Tooltip title="Login&Register">
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          color="inherit"
        >
          <IoMdLogIn />
        </IconButton>
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
        {pages
          .filter(page => page.path !== pathname)
          .map(page => (
            <Link key={page.path} to={page.path}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>{page.icon}</ListItemIcon>
                {page.label}
              </MenuItem>
            </Link>
          ))}
      </Menu>
    </div>
  )
}

export default AuthMenu
