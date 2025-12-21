import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import "../css/navbar.css"
function Navbar() {
  const { userid } = useParams()
  const isLoggedIn = Boolean(userid)

  return (
    <>
      <nav data-cy="navigation-bar">
        {isLoggedIn && (
          <div className="inner-navbar">
            <Link data-cy="home-navigation-link" to={`/landingpage/${userid}`}>
              Home
            </Link>

            <Link
              data-cy="user-specific-rooms"
              to={`/landingpage/rooms/${userid}`}
              className="navLink"
            >
              Your rooms
            </Link>

            <Link
              data-cy="create-room-link"
              to={`/landingpage/${userid}/newroom`}
              className="navLink"
            >
              Create new room
            </Link>

            <Link to="/">Logout</Link>
          </div>
        )}

        {!isLoggedIn && (
          <div>
            <Link data-cy="home-navigation-link" to="/">
              Home
            </Link>
            <Link data-cy="signup-link" to="/signup">
              Sign up
            </Link>
            <Link data-cy="login-link" to="/login">
              Login
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
