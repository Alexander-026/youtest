import { Backdrop, Box, CircularProgress } from "@mui/material"
import type { ReactNode } from "react";
import type React from "react"

type LoaderWrapperType = {
  loading: boolean
  data: any
  children: ReactNode
}

const LoaderWrapper: React.FC<LoaderWrapperType> = ({
  data,
  loading,
  children,
}) => {
  return (
    <Box>
      <Backdrop
        sx={{
          color: "#13259c",
          backgroundColor: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {data && children}
    </Box>
  )
}

export default LoaderWrapper
