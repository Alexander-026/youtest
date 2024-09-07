/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "@mui/material"
import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import { useLazyRefreshQuery, useLogoutMutation } from "../app/api/usersApiSlice"
import useLocalStorage from "../hooks/useLocalStorage"
import { useCallback, useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import { userSlice } from "../features/user/userSlice"
import { useNavigate } from "react-router-dom"

const Layout = () => {
  const [token, setToken, removeToken] = useLocalStorage("accessToken")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { onUser, logOut } = userSlice.actions
  const [refresh] = useLazyRefreshQuery()
  const [logOutApiCall] = useLogoutMutation()

  const refreshHandler = useCallback(async () => {
    try {
      if (token) {
        const res = await refresh().unwrap()
        setToken(res.accessToken)
        dispatch(onUser(res.user))
      }
    } catch (error) {
      dispatch(logOut())
      removeToken()
      await logOutApiCall()
      navigate("/", { replace: true })
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
