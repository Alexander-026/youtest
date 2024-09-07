import {
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import { useGetUsersQuery } from "../../app/api/usersApiSlice"
import LoaderWrapper from "../../components/LoaderWrapper"
import MyAvatar from "../../components/MyAvatar"
import React from "react"

const Users = () => {
  const { data, isLoading, isError, error } = useGetUsersQuery()

  console.log("usersss", data)
  if (error) {
    console.log((error as any).data.message)
  }

  return (
    <LoaderWrapper loading={isLoading} data={data}>
      <Typography align="center" variant="h4">
        Users
      </Typography>
      {isError && <Alert severity="error">{(error as any).data.message}</Alert>}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {data?.map(user => (
          <React.Fragment key={user.id}>
            <ListItem>
              <ListItemAvatar>
                <MyAvatar user={user} />
              </ListItemAvatar>
              <ListItemText
                primary={`${user.firstName} ${user.lastName}`}
                secondary={<Typography>{user.birthDate}</Typography>}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </LoaderWrapper>
  )
}

export default Users
