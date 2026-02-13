import { database } from "../database.ts"
import type { QueryResult } from "pg"
import bcrypt from "bcryptjs"
interface User {
  user_id: number
  user_name: string
  user_mail: string
  user_password: string
  user_birthday: string | null
  user_age: number | null
}

export function getUsers(): Promise<User[]> {
  return new Promise<User[]>((resolve, reject) => {
    const query = "SELECT * FROM Users;"
    database.query(query, (err: Error | null, res: QueryResult) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.rows as User[])
      }
    })
  })
}

export function getUserById(id: number) {
  return new Promise<User>((resolve, reject) => {
    const query = "SELECT * FROM Users WHERE user_id = $1;"
    database.query(query, [id], (err: Error, res: QueryResult) => {
      if (err) {
        reject(err)
      } else {
        // console.log(res.rows[0])
        resolve(res.rows[0] as User)
      }
    })
  })
}

export async function loginUser(user_mail: string, user_password: string) {
  const query = "SELECT * FROM Users WHERE user_mail = $1;"
  const res = await database.query(query, [user_mail])
  const user = res.rows[0] as User | undefined

  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isMatch: boolean = await bcrypt.compare(
    user_password,
    user.user_password
  )

  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  return user
}

export async function createUser(
  user_name: string,
  user_mail: string,
  user_password: string,
  user_birthday: string | null,
  user_age: number | null
) {
  const salt: string = await bcrypt.genSalt(10)
  const hashedPassword: string = await bcrypt.hash(user_password, salt)
  const query =
    "INSERT INTO Users(user_name, user_mail, user_password, user_birthday, user_age) VALUES($1, $2, $3, $4, $5) RETURNING *"
  const res = await database.query(query, [
    user_name,
    user_mail,
    hashedPassword,
    user_birthday,
    user_age,
  ])
  console.log("User created")
  return res.rows[0] as User
}

// export default {
//   getUsers,
//   getUserById,
//   loginUser,
//   createUser,
// }
