import Home from "./components/home"
import Signin from "./components/sign-in"
import Login from "./components/login"
import LandingPage from "./components/landing-page"
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom"

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <Signin />, path: "/signin" },
        { element: <Login />, path: "/login" },
        { element: <LandingPage />, path: "/landingpage/:userid" },
      ],
      element: (
        <>
          <Outlet />
        </>
      ),
    },
  ])

  return <RouterProvider router={router}></RouterProvider>
}

export default App
