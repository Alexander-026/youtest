import { Container } from "@mui/material"
import { Outlet } from "react-router-dom"

const Main = () => {
  return (
    <Container
      component="main"
      sx={{
        // py: "1rem",
        bgcolor: "#FFFFFF",
        height: "calc(100vh - 6rem)",
        padding: { md: "1rem", xs: 0 },
      }}
      maxWidth={false}
    >
      <Outlet />
    </Container>
  )
}

export default Main
