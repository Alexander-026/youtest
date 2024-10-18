import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled
} from "@mui/material"
import type React from "react"
import { NavLink } from "react-router-dom"
import type { Pages } from "../types/pages"


const StyledNavLink = styled(NavLink)(({ theme }) => ({
  "&.active .list-item": {
    backgroundColor: theme.palette.success.main, 
    color: theme.palette.common.white, 
  },
  "&.active .list-item__icon": {
    color: theme.palette.common.white, 
  }
}));


const DriwerItem: React.FC<{ page: Pages }> = ({ page }) => {
  return (
    <StyledNavLink
      to={page.path}
      className={({ isActive, isPending }) => {
        return `${isPending ? "pending" : isActive ? "active" : ""}`
      }}
    >
      <ListItem className="list-item" disablePadding>
        <ListItemButton>
          <ListItemIcon className="list-item__icon">{page.icon}</ListItemIcon>
          <ListItemText primary={page.label} />
        </ListItemButton>
      </ListItem>
    </StyledNavLink>
  )
}

export default DriwerItem
