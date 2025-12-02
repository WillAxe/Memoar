import { database } from "../database.ts"
import type { QueryResult } from "pg"

interface User {
  user_id: number
  user_name: string
  user_mail: string
  user_password: string
  user_birthday: Date
  user_age: number
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

export function loginUser(user_mail: string, user_password: string) {
  return new Promise<User>((resolve, reject) => {
    const query =
      "SELECT * FROM Users WHERE user_mail = $1 AND user_password = $2;"
    database.query(
      query,
      [user_mail, user_password],
      (err: Error, res: QueryResult) => {
        if (err) {
          reject(err)
        } else {
          console.log(res.rows)
          resolve(<User>res.rows[0])
        }
      }
    )
  })
}

export function createUser(
  user_name: string,
  user_mail: string,
  user_password: string,
  user_birthday: Date,
  user_age: number
) {
  return new Promise<User>((resolve, reject) => {
    const query =
      "INSERT INTO Users(user_name, user_mail, user_password, user_birthday, user_age) VALUES($1, $2, $3,$4, $5) RETURNING *"
    database.query(
      query,
      [user_name, user_mail, user_password, user_birthday, user_age],
      (err: Error, res: QueryResult) => {
        if (err) {
          reject(err)
        } else {
          console.log("User created")
          resolve(res.rows[0] as User)
        }
      }
    )
  })
}

// export default {
//   getUsers,
//   getUserById,
//   loginUser,
//   createUser,
// }
