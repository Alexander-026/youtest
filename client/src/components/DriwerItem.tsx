import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import type React from "react"
import { Link } from "react-router-dom"
import type { Pages } from "../types/pages"

const DriwerItem: React.FC<{ page: Pages }> = ({ page }) => {
  return (
    <Link to={page.path}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>{page.icon}</ListItemIcon>
          <ListItemText primary={page.label} />
        </ListItemButton>
      </ListItem>
    </Link>
  )
}

export default DriwerItem
