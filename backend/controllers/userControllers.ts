import {
  getUsers as getUsersService,
  getUserById as getUserByIdService,
  loginUser as loginUserService,
  createUser as createUserService,
} from "../services/userServices.ts"
import type { Response, Request } from "express"

interface UserResponse {
  user_id: number
  user_name: string
  user_mail: string
  user_password: string
  user_birthday: string | null
  user_age: number | null
}

export const getUsers = async (
  _req: Request,
  res: Response<
    { users: UserResponse[] } | { message: string; error?: unknown }
  >
): Promise<void> => {
  try {
    const usersFromDb = await getUsersService()
    const users: UserResponse[] = usersFromDb.map((u) => ({
      user_id: u.user_id,
      user_name: u.user_name,
      user_mail: u.user_mail,
      user_password: u.user_password,
      user_birthday: u.user_birthday,
      user_age: u.user_age,
    }))
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error })
  }
}

export const getUserById = async (
  req: Request,
  res: Response<{ user: UserResponse } | { message: string; error?: unknown }>
): Promise<void> => {
  try {
    const id = req.params.id
    const userFromDb = await getUserByIdService(Number(id))
    const user: UserResponse = {
      user_id: userFromDb.user_id,
      user_name: userFromDb.user_name,
      user_mail: userFromDb.user_mail,
      user_password: userFromDb.user_password,
      user_birthday: userFromDb.user_birthday,
      user_age: userFromDb.user_age,
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error })
  }
}

export const createUser = async (
  req: Request<{
    user: UserResponse
  }>,
  res: Response
): Promise<void> => {
  try {
    const { user_name, user_mail, user_password, user_birthday, user_age } =
      req.body
    console.log("The body that I send", req.body)
    const user = await createUserService(
      user_name,
      user_mail,
      user_password,
      user_birthday,
      user_age
    )
    res
      .status(201)
      .json({
        success: true,
        message: "Successfully created a user account!",
        user: user.user_name,
      })
  } catch (error) {
    res.status(500).json({ message: "Error creating an user", error })
  }
}

export const loginUser = async (
  req: Request<{ user: UserResponse }>,
  res: Response
): Promise<void> => {
  try {
    const { user_mail, user_password } = req.body
    const user = await loginUserService(user_mail, user_password)
    res.status(200).json({
      sucess: true,
      user: user.user_name,
      message: "Successfully logged in",
    })
  } catch (error) {
    res.status(500).json({ message: "error logging in", error })
  }
}
