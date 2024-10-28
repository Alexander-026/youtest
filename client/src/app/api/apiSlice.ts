import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
import type { User } from "../../types/user"
import { userSlice } from "../../features/user/userSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: headers => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  let result = (await baseQuery(args, api, extraOptions)) as any

  const { onUser, logOut } = userSlice.actions

  if (result?.error?.originalStatus === 401) {
    const refreshResult = await baseQuery(
      `${import.meta.env.VITE_USERS_URL}/refresh`,
      api,
      extraOptions,
    )

    if (refreshResult?.data) {
      const updatedUser = refreshResult?.data as User
      localStorage.setItem("accessToken", updatedUser.accessToken)
      api.dispatch(onUser(updatedUser.user))

      result = await baseQuery(args, api, extraOptions)
    } else {
      await baseQuery(
        { url: `${import.meta.env.VITE_USERS_URL}/logout`, method: "POST" },
        api,
        extraOptions,
      )
      localStorage.removeItem("accessToken")
      api.dispatch(logOut())
    }
  } else if (result?.error?.originalStatus === 403) {
    await baseQuery(
      { url: `${import.meta.env.VITE_USERS_URL}/logout`, method: "POST" },
      api,
      extraOptions,
    )
    localStorage.removeItem("accessToken")
    api.dispatch(logOut())
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["wordPairs", "users", "friendRequests", "Conversation"],
  endpoints: () => ({}),
})
