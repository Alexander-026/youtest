import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

const AdminRouter = () => {
  const { user } = useAppSelector(state => state.user)
  return user?.isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}

export default AdminRouter
