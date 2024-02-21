import { Container, Box } from "@mui/material"

const Footer = () => {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "darkcyan",
        height: "2rem"
      }}
      component="footer"
    >
      <Container maxWidth="xl">Footer</Container>
    </Box>
  )
}

export default Footer
