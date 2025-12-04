import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ApiUserResponse } from "./static/interfaces"
import { Link } from "react-router-dom"
import "../css/login.css"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [correctInput, setCorrectInput] = useState<boolean>(false)

  function toogleClass() {
    setCorrectInput(!correctInput)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response: Response = await fetch(
        "http://localhost:3000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_mail: email, user_password: password }),
        }
      )

      if (!response.ok) {
        throw new Error("Wrong credentials")
      }
      const data: ApiUserResponse = await response.json()
      const userId: number = data.user_id
      localStorage.setItem("userID", userId.toString())
      navigate(`/landingpage/${userId}`)
    } catch (error) {
      alert("Login failed, check your credentials")
      console.error("Login error:", error)
    }
  }

  return (
    <>
      <div>
        <h1>Login</h1>
        <Link to="/">go back</Link>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            email *:
            <input
              onChange={(e) => {
                setEmail(e.target.value)
                toogleClass()
              }}
              data-cy="mail-input-lgn"
              type="email"
              name="email"
              required
            />
          </label>
          <label>
            password *:
            <input
              onChange={(e) => setPassword(e.target.value)}
              data-cy="psw-input-lgn"
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
