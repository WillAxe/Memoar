import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ApiUserResponse } from "./static/interfaces"
import { Link } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res: Response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_mail: email, user_password: password }),
      })

      if (!res.ok) {
        throw new Error("Wrong credentials")
      }
      const data: ApiUserResponse = await res.json()
      const userId: number = data.user_id
      localStorage.setItem("UserID", userId.toString())
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
        <form onSubmit={handleSubmit}>
          <label>
            email *:
            <input
              onChange={(e) => setEmail(e.target.value)}
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

          <label>
            your birthday(optional):
            <input type="date" name="birthday" />
          </label>

          <label>
            age(optional):
            <input type="number" name="age" />
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
