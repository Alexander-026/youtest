import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import Layout from "./layout/Layout"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminRouter from "./components/AdminRouter"
import Users from "./pages/private/Users"
import PrivateRouter from "./components/PrivateRouter"
import Settings from "./pages/User/Settings"
import Profile from "./pages/User/Profile"
import WordGeneratorPage from "./pages/WordGeneratorPage/WordGeneratorPage"
import SettingsPair from "./pages/SettingsPairPage/SettingsPair"
import PracticWordsPage from "./pages/PracticWordsPage/PracticWordsPage"
import Home from "./pages/Home"
import FriendsPage from "./pages/private/FriendsPage"
const App = () => {
  const root = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index path="" element={<Home/>} />
         

          <Route path="" element={<PrivateRouter />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
           
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<>Messages</>} />
            <Route path="/notifications" element={<>Notifications</>} />
            <Route path="/friends" element={<FriendsPage/>} />
          </Route>

          <Route path="/admin" element={<AdminRouter />}>
           
            <Route path="/admin/generator" element={<WordGeneratorPage />} />
            <Route path="/admin/generator/:id" element={<SettingsPair />} />
          </Route>

          <Route path="*" element={<>Not Found</>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="" element={<PrivateRouter />}>
          <Route path="/practic/:id" element={<PracticWordsPage />} />
        </Route>
      </>,
    ),
  )
  return <RouterProvider router={root} />
}

export default App
