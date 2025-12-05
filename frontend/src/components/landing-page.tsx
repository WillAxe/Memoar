import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import type { ApiUserResponse } from "./static/interfaces"

const userId: string = localStorage.getItem("userID")!

function LandingPage() {
  const [user, setUser] = useState<ApiUserResponse | null>(null)
  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((response) => response.json())
      .then((result: { user: ApiUserResponse }) => {
        setUser(result.user)
      })
  }, [])
  return (
    <>
      <h1>{user ? `Welcome ${user.user_name}!` : "None"}</h1>
      <main>
        <nav className="innerNavbar">
          <div>
            <Link to={`/landingpage/rooms/${userId}`} className="navLink">
              Your rooms
            </Link>

            <Link to={`/joinroom`} className="navLink">
              Join room
            </Link>

            <Link to={`/newroom`} className="navLink">
              Create new room
            </Link>
          </div>
        </nav>
        <section className="start-feed"></section>
      </main>
    </>
  )
}

export default LandingPage
