import type {
  ContactMe,
  DecodedUser,
  LoginUser,
  RegisterUser,
  UpdateUser,
  User,
} from "../../types/user"
import { apiSlice } from "./apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<User, LoginUser>({
      query: data => ({
        url: `${import.meta.env.VITE_USERS_URL}/login`, // for develop
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<User, RegisterUser>({
      query: data => ({
        url: `${import.meta.env.VITE_USERS_URL}/registration`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation<User, UpdateUser>({
      query: data => ({
        url: `${import.meta.env.VITE_USERS_URL}/update`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadUserImage: builder.mutation({
      query: data => ({
        url: `${import.meta.env.VITE_UPLOAD_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    removeUserImage: builder.mutation<void, { filePath: string }>({
      query: data => ({
        url: import.meta.env.VITE_UPLOAD_URL,
        method: "DELETE",
        body: data,
      }),
    }),
    refresh: builder.query<User, void>({
      query: () => ({
        url: `${import.meta.env.VITE_USERS_URL}/refresh`,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${import.meta.env.VITE_USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getUsers: builder.query<DecodedUser[], void>({
      query: () => ({
        url: import.meta.env.VITE_USERS_URL,
      }),
    }),
    sendEmail: builder.mutation<any, ContactMe>({
      query: (data) => ({
        url: `${import.meta.env.VITE_CONTACT_US}/sendemail`,
        method: "POST",
        body: data,
      }),
    })
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useRemoveUserImageMutation,
  useUploadUserImageMutation,
  useLazyRefreshQuery,
  useLogoutMutation,
  useGetUsersQuery,
  useSendEmailMutation
} = userApiSlice
