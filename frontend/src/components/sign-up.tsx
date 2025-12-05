import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import type {
  FormData,
  SendPayload,
  ApiUserResponse,
} from "./static/interfaces"

function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    birthday: "",
    age: 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload: SendPayload = {
        ...formData,
        user_name: formData.name,
        user_mail: formData.email,
        user_password: formData.password,
        user_birthday: formData.birthday,
        user_age: formData.age,
      }

      const response: Response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        const data: ApiUserResponse = await response.json()
        console.log(data)
        const userId: number = data.user_id
        localStorage.setItem("userID", userId.toString())
        setFormData({ name: "", email: "", password: "", birthday: "", age: 0 })
        navigate(`/landingpage/${userId}`)
      } else {
        let msg: string = "Something went wrong when creating the account"
        try {
          const body = await response.json()
          if (body && body.error) msg = body.error
        } catch {
          const msg: string = "Error"
          alert(msg)
        }
        alert(msg)
      }
    } catch (error) {
      console.error("error:", error)
      alert("Server error.")
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    const parsedAge = type === "number" ? Number(value) : value

    setFormData((prev) => ({
      ...prev,
      [name]: parsedAge,
    }))
  }

  return (
    <>
      <div>
        <h1>Create Account</h1>
        <p>
          <Link to="/">Back</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Name *:
            <input
              data-cy="name-input-signup"
              onChange={handleChange}
              type="text"
              name="name"
              required
            />
          </label>
          <label>
            email *:
            <input
              data-cy="mail-input-signup"
              onChange={handleChange}
              type="email"
              name="email"
              required
            />
          </label>
          <label>
            password *:
            <input
              data-cy="psw-input-signup"
              onChange={handleChange}
              type="password"
              name="password"
              required
            />
          </label>

          <label>
            your birthday(optional):
            <input onChange={handleChange} type="date" name="birthday" />
          </label>

          <label>
            age(optional):
            <input onChange={handleChange} type="number" name="age" />
          </label>
          <div>
            <input
              data-cy="signup-btn"
              type="submit"
              value=" Create Account/Sign Up"
            ></input>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignUp
