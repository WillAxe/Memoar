import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ApiUserResponse } from "./static/interfaces"
import { Link } from "react-router-dom"
import "../css/login.css"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [validateEmail, setValidateEmail] = useState<boolean>(false)
  const [validatePassword, setValidatePassword] = useState<boolean>(false)
  const [loginFailed, setLoginFailed] = useState<boolean>(false)
  const [showLoginSuccess, setShowLoginSuccess] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      setValidateEmail(emailRegex.test(value))
      setEmail(value)
    }

    if (name === "password") {
      const passwordRegex = /^.{4,}$/
      setValidatePassword(passwordRegex.test(value))
      setPassword(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response: Response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ user_mail: email, user_password: password }),
      })

      if (!response.ok) {
        setLoginFailed(true)
        throw new Error("Wrong credentials")
      }

      const data: ApiUserResponse = await response.json()
      const userId: number = data.user_id
      localStorage.setItem("userID", userId.toString())
      sessionStorage.setItem("isLoggedIn", true.toString())
      setShowLoginSuccess(true)
      setLoginFailed(false)
      navigate(`/landingpage/${userId}`)
    } catch (error) {
      alert("Login failed, check your credentials")
      console.error("Login error:", error)
    }
  }

  return (
    <>
      {showLoginSuccess && (
        <div data-cy="login-notification-msg" className="login-success">
          Successfully logged in!
        </div>
      )}
      <div>
        <h1>Login</h1>
        <Link to="/">go back</Link>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            email *:
            <input
              onChange={handleChange}
              data-cy="mail-input-lgn"
              className={
                loginFailed
                  ? "wrong-input"
                  : validateEmail
                  ? "correct-input"
                  : "wrong-input"
              }
              type="email"
              name="email"
              required
            />
          </label>
          <label>
            password *:
            <input
              onChange={handleChange}
              data-cy="psw-input-lgn"
              className={
                loginFailed
                  ? "wrong-input"
                  : validatePassword
                  ? "correct-input"
                  : "wrong-input"
              }
              type="password"
              name="password"
              required
            />
          </label>
          <div>
            <input data-cy="login-btn" type="submit" value="Login"></input>
          </div>
        </form>
        <p>
          <Link to="/signup">No account? Sign up here!</Link>
        </p>
      </div>
    </>
  )
}

export default Login
