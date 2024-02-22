import { Backdrop, CircularProgress } from "@mui/material"
import React, { ReactNode } from "react"

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
    <>
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
    </>
  )
}

export default LoaderWrapper
