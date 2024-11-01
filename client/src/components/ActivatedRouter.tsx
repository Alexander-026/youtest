import { Navigate, Outlet, useParams } from "react-router-dom"
import { useLazyConfirmEmailQuery } from "../app/api/usersApiSlice"
import { useCallback, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import LoaderWrapper from "./LoaderWrapper"

const ActivatedRouter = () => {
  const { userId } = useParams<{ userId: string }>()
  const [confirmEmail, { isError, error, isLoading, data }] =
    useLazyConfirmEmailQuery()



    console.log("userId", userId)

  const confirmHandler = useCallback(() => {
    if (userId) {
      confirmEmail({userId})
    }
  }, [confirmEmail, userId])

  useEffect(() => {
    confirmHandler()
  }, [confirmHandler])

  if (isError) {
    console.log("isError", error)
    return <Navigate to="/" replace/>
  }
  return (
    <LoaderWrapper loading={isLoading} data={data}>
      <>
       {data?.emailStatus === "confirmed" ?  <Outlet /> : <Navigate to="/" replace/>}
      </>
    </LoaderWrapper>
  )
}

export default ActivatedRouter
