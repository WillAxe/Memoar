import { lazy } from "react"
import Home from "./views/home"
import Signup from "./views/sign-up"
import Login from "./views/login"
const LandingPage = lazy(() => import("./views/landingpage"))
const UserRooms = lazy(() => import("./views/user-rooms"))
const Room = lazy(() => import("./views/room"))
const NewRoom = lazy(() => import("./views/new-room"))
// import Notifications from "./components/notification"
import Navbar from "./components/navbar"
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom"

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <Signup />, path: "/signup" },
        { element: <Login />, path: "/login" },
        { element: <LandingPage />, path: "/landingpage/:userid" },
        { element: <UserRooms />, path: "/landingpage/rooms/:userid" },
        { element: <Room />, path: "/landingpage/:userid/room/:roomid" },
        { element: <NewRoom />, path: "/landingpage/:userid/newroom" },
      ],
      element: (
        <>
          <Navbar data-cy="navigation-bar" />
          <Outlet></Outlet>
        </>
      ),
    },
  ])
  return <RouterProvider router={router}></RouterProvider>
}

export default App
