import Home from "./components/home"
import Signup from "./components/sign-up"
import Login from "./components/login"
import LandingPage from "./components/landing-page"
import UserRooms from "./components/user-rooms"
import Room from "./components/room"
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
        { element: <Room />, path: "/landingpage/room/:roomid" },
      ],
      element: (
        <>
          <Outlet></Outlet>
          <Navbar data-cy="navigation-bar" />
        </>
      ),
    },
  ])
  return <RouterProvider router={router}></RouterProvider>
}

export default App
