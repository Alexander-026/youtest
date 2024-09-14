/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "@mui/material"
import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import { useRefreshMutation, useLogoutMutation } from "../app/api/usersApiSlice"
import useLocalStorage from "../hooks/useLocalStorage"
import { useCallback, useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import { userSlice } from "../features/user/userSlice"
import { useNavigate } from "react-router-dom"

const Layout = () => {
  const [token, setToken, removeToken] = useLocalStorage("accessToken")
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage("refreshToken")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { onUser, logOut } = userSlice.actions
  const [refresh] = useRefreshMutation()
  const [logOutApiCall] = useLogoutMutation()

  const refreshHandler = useCallback(async () => {
    try {
      if (token && refreshToken) {
        const res = await refresh({refreshToken}).unwrap()
        setToken(res.accessToken)
        setRefreshToken(res.refreshToken)
        dispatch(onUser(res.user))
      }
    } catch (error) {
      dispatch(logOut())
      removeToken()
      removeRefreshToken()
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
