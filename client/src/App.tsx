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
import Users from "./pages/admin/Users"
import PrivateRouter from "./components/PrivateRouter"
import Settings from "./pages/User/Settings"
import Profile from "./pages/User/Profile"
import WordGeneratorPage from "./pages/WordGeneratorPage/WordGeneratorPage"
import SettingsPair from "./pages/SettingsPairPage/SettingsPair"
import PracticWordsPage from "./pages/PracticWordsPage/PracticWordsPage"
import Home from "./pages/Home"
const App = () => {
  const root = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index path="" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="" element={<PrivateRouter />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/generator" element={<WordGeneratorPage />} />
            <Route path="/generator/:id" element={<SettingsPair />} />
          </Route>

          <Route path="/admin" element={<AdminRouter />}>
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="*" element={<>Not Found</>} />
        </Route>
        <Route path="" element={<PrivateRouter />}>
          <Route path="/practic/:id" element={<PracticWordsPage />} />
        </Route>
      </>,
    ),
  )
  return <RouterProvider router={root} />
}

export default App
