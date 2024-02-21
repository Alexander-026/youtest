import { useGetUsersQuery } from "../../app/api/usersApiSlice"

const Users = () => {
  const { data, isLoading, isError, error } = useGetUsersQuery()

  console.log("usersss", data)
  if (error) {
    console.log((error as any).data.message)
  }

  return (
    <div>
      <h1>serere</h1>
      {isLoading && <p>Loadding...</p>}
      <ul>{/* {data?.map((u) => <li>{u.}</li>)} */}</ul>
    </div>
  )
}

export default Users
