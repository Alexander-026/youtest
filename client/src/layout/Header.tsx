import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  Stack,
  CssBaseline,
} from "@mui/material"
import Drawer from "@mui/joy/Drawer"
import { memo, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaUsers } from "react-icons/fa"
import { BsTranslate } from "react-icons/bs"
import { Link } from "react-router-dom"
import AuthMenu from "../components/AuthMenu"
import { useAppSelector } from "../app/hooks"
import type { Pages } from "../types/pages"
import DriwerItem from "../components/DriwerItem"
import { GiThreeFriends } from "react-icons/gi"
import Notifications from "../components/Notifications"
import AccountMenu from "../components/AccountMenu"
import MessageNotifications from "../components/MessageNotifications"

const pages: Pages[] = [
  {
    path: "/users",
    icon: <FaUsers size={20} />,
    label: "Users",
    isAdmin: false,
  },
  {
    path: "/friends",
    icon: <GiThreeFriends size={20} />,
    label: "Friends",
    isAdmin: false,
  },
  {
    path: "/admin/generator",
    icon: <BsTranslate size={20} />,
    label: "Generate Words",
    isAdmin: true,
  },
]

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useAppSelector(state => state.user)

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Drawer
          color="neutral"
          invertedColors
          size="sm"
          variant="soft"
          component="aside"
          anchor={"left"}
          open={!!user && open}
          onClose={() => setOpen(false)}
        >
          <List onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
            {user?.isAdmin &&
              pages
                .filter(page => page.isAdmin === user?.isAdmin)
                .map(p => <DriwerItem key={p.path} page={p} />)}
            {pages
              .filter(page => !page.isAdmin)
              .map(p => (
                <DriwerItem key={p.path} page={p} />
              ))}
          </List>
        </Drawer>
        <Toolbar>
          <Stack
            flexGrow={1}
            direction={"row"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction={"row"} alignItems="center" gap={2}>
              {user && (
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => setOpen(true)}
                >
                  <GiHamburgerMenu />
                </IconButton>
              )}
              <Link to="/">
                <Typography variant="h5" component="h6">
                  YouTest
                </Typography>
              </Link>
            </Stack>

            {user ? (
              <Stack direction={"row"} alignItems="center" gap={1}>
                <MessageNotifications />
                <Notifications />
                <AccountMenu />
              </Stack>
            ) : (
              <AuthMenu />
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}

export default Header
