import { Container, Box } from "@mui/material"
import TextSlider from "../components/TextSlider/TextSlider"

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "darkcyan",
        height: "2rem"
      }}
      component="footer"
    >
      {/* <Container maxWidth={false}>
        <TextSlider/>
      </Container> */}
    </Box>
  )
}

export default Footer
