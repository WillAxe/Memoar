import { Link } from "react-router-dom"
function Navbar() {
  return (
    <>
      <nav data-cy="navigation-bar">
        <Link data-cy="home-navigation-link" to="/">
          Home
        </Link>
        <Link data-cy="signup-link" to="/signup">
          Sign up
        </Link>
        <Link data-cy="login-link" to="/login">
          Login
        </Link>
      </nav>
    </>
  )
}
export default Navbar
