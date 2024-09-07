import { Container, Box } from "@mui/material"
import { Outlet } from "react-router-dom"

const Main = () => {
  return (
    <Box component="main" flexGrow={1} bgcolor="white">
      <Container sx={{py: "1rem"}} maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  )
}

export default Main
