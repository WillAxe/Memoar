import Home from "./components/home"
import Signup from "./components/sign-up"
import Login from "./components/login"
import LandingPage from "./components/landingpage"
import UserRooms from "./components/user-rooms"
import Room from "./components/room"
import NewRoom from "./components/new-room"
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
        // { element: <Notifications />, path: "/notifications" },
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
