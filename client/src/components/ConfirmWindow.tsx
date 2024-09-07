import {
  Backdrop,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material"

type ConfirmWindowProps = {
  open: boolean
  ok: () => void
  no?: () => void
  text: string
  okText?: string
  noText?: string
}

const ConfirmWindow: React.FC<ConfirmWindowProps> = ({
  open,
  text,
  okText,
  noText,
  no,
  ok,
}) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <Paper sx={{ padding: "1rem" }}>
        <Stack gap={2}>
          <Typography textAlign="center" variant="h5">
            {text}
          </Typography>
          <Divider />
          <Stack direction={"row"} justifyContent={"center"} gap={1}>
            <Button onClick={ok} variant="contained">
              {okText ?? "Ja"}
            </Button>
            {no && (
              <Button onClick={no} variant="outlined">
                {noText ?? "Nein"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Backdrop>
  )
}

export default ConfirmWindow
