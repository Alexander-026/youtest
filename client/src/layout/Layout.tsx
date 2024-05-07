/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "@mui/material"
import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import { useLazyRefreshQuery } from "../app/api/usersApiSlice"
import useLocalStorage from "../hooks/useLocalStorage"
import { useCallback, useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import { userSlice } from "../features/user/userSlice"

const Layout = () => {
  const [token, setToken] = useLocalStorage("accessToken")
  const dispatch = useAppDispatch()
  const { onUser } = userSlice.actions
  const [refresh] = useLazyRefreshQuery()

  const refreshHandler = useCallback(async () => {
    if (token) {
      const res = await refresh().unwrap()
      setToken(res.accessToken)
      dispatch(onUser(res.user))
    }
  }, [])

  useEffect(() => {
    refreshHandler()
  }, [])


  return (
    <Stack
      sx={{ minHeight: "100vh", bgcolor: "darkslategrey" }}
      direction="column"
    >
      <Header />
      <Main />
      <Footer />
    </Stack>
  )
}

export default Layout
