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
    refresh: builder.mutation<User, {refreshToken: string}>({
      query: (body) => ({
        url: `${import.meta.env.VITE_USERS_URL}/refresh`,
        method: "POST",
        body
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${import.meta.env.VITE_USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getUsers: builder.query<DecodedUser[],void>({
      query: () => ({
        url: import.meta.env.VITE_USERS_URL,
      }),
      providesTags: ["users"]
    }),
    sendEmail: builder.mutation<any, ContactMe>({
      query: (data) => ({
        url: `${import.meta.env.VITE_CONTACT_US}/sendemail`,
        method: "POST",
        body: data,
      }),
    }),
    friendRequest: builder.mutation<any, {myUserId:string, senderUserId:string}>({
      query: (data) => ({
        url: `${import.meta.env.VITE_USERS_URL}/friendRequest`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"]
    }),
    acceptFriendship: builder.mutation<any, {myUserId:string, senderUserId:string}>({
      query: (data) => ({
        url: `${import.meta.env.VITE_USERS_URL}/acceptFriendship`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["friendRequests", "users"]
    }),
    cancelFriendship: builder.mutation<any, {myUserId:string, senderUserId:string}>({
      query: (data) => ({
        url: `${import.meta.env.VITE_USERS_URL}/cancelFriendship`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"]
    }),
    getUsersById: builder.mutation<Pick<DecodedUser, "firstName" | "lastName" | "id" | "image">[], {userIds: string[]}>({
      query: (data) => {
          // Преобразуем массив в строку
        return {
          url: `${import.meta.env.VITE_USERS_URL}/getUsersById`,
          method: "POST",
          body: data
        }
      },
      invalidatesTags: ["friendRequests"]
    }),

  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useRemoveUserImageMutation,
  useUploadUserImageMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useSendEmailMutation,
  useFriendRequestMutation,
  useAcceptFriendshipMutation,
  useCancelFriendshipMutation,
  useGetUsersByIdMutation

} = userApiSlice
