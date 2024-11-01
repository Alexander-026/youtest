import { Container } from "@mui/material"
import { Outlet } from "react-router-dom"

const Main = () => {
  return (
    <Container
      component="main"
      sx={{
        bgcolor: "#FFFFFF",
        height: "100%",
        py: '1rem'
      }}
      maxWidth={false}
    >
      <Outlet />
    </Container>
  )
}

export default Main
