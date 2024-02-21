import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  Stack,
} from "@mui/material"
import Drawer from "@mui/joy/Drawer"
import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaUsers } from "react-icons/fa"
import { BsTranslate } from "react-icons/bs"
import { Link } from "react-router-dom"
import AuthMenu from "../components/AuthMenu"
import AccountMenu from "../components/AccountMenu"
import { useAppSelector } from "../app/hooks"
import type { Pages } from "../types/pages"
import DriwerItem from "../components/DriwerItem"

const pages: Pages[] = [
  {
    path: "/admin/users",
    icon: <FaUsers size={20} />,
    label: "Users",
    isAdmin: true,
  },
  {
    path: "/generator",
    icon: <BsTranslate size={20} />,
    label: "Generate Words",
    isAdmin: false,
  },
]

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useAppSelector(state => state.user)
  return (
    <AppBar position="sticky">
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
        {user && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <GiHamburgerMenu />
          </IconButton>
        )}

        <Stack
          flexGrow={1}
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link to="/">
            <Typography variant="h6" component="div">
              YouTest
            </Typography>
          </Link>

          {user ? <AccountMenu /> : <AuthMenu />}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Header
