import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

const PrivateRouter = () => {
  const { user } = useAppSelector(state => state.user)
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRouter
