import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import type {
  FormData,
  SendPayload,
  ApiUserResponse,
} from "./static/interfaces";
import "../css/signup.css";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    birthday: "",
    age: 0,
  });

  const [validateEmail, setValidateEmail] = useState<boolean>(true);
  const [validatePassword, setValidatePassword] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload: SendPayload = {
        ...formData,
        user_name: formData.name,
        user_mail: formData.email,
        user_password: formData.password,
        user_birthday: formData.birthday,
        user_age: formData.age,
      };

      const response: Response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data: ApiUserResponse = await response.json();
        console.log(data);
        const userId: number = data.user_id;
        localStorage.setItem("userID", userId.toString());
        sessionStorage.setItem("isLoggedIn", true.toString());
        setFormData({
          name: "",
          email: "",
          password: "",
          birthday: "",
          age: 0,
        });
        navigate(`/landingpage/${userId}`);
      } else {
        let msg: string = "Something went wrong when creating the account";
        try {
          const body = await response.json();
          if (body && body.error) msg = body.error;
        } catch {
          const msg: string = "Error";
          alert(msg);
        }
        alert(msg);
      }
    } catch (error) {
      console.error("error:", error);
      alert("Server error.");
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setValidateEmail(false);
        return;
      } else setValidateEmail(true);
    }

    if (name === "password") {
      const passwordRegex = /^[a-zA-Z-9]{4,}$/;
      if (!passwordRegex.test(value)) {
        setValidatePassword(false);
        return;
      } else {
        setValidatePassword(true);
      }
    }

    const parsedAge = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedAge,
    }));
  };

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
              className={`input-field ${
                validateEmail ? "correct-input" : "wrong-input"
              }`}
              onChange={handleChange}
              type="email"
              name="email"
              required
            />
            {!validateEmail && (
              <small style={{ color: "red" }}>Invalid email format</small>
            )}
          </label>
          <label>
            password *:
            <input
              data-cy="psw-input-signup"
              onChange={handleChange}
              className={`input-field ${
                validatePassword ? "correct-input" : "wrong-input"
              }`}
              type="password"
              name="password"
              required
            />
            {!validatePassword && (
              <small style={{ color: "red" }}>
                Password need to be 4 character or more long
              </small>
            )}
          </label>

          <label>
            your birthday(optional):
            <input
              onChange={handleChange}
              type="date"
              name="birthday"
              required
            />
          </label>

          <label>
            age(optional):
            <input onChange={handleChange} type="number" name="age" required />
          </label>
          <div>
            <input
              data-cy="signup-btn"
              type="submit"
              value=" Create Account/Sign Up"
              disabled={!validateEmail || !validatePassword}
            ></input>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
