export type ApiUserResponse = {
  user_id: number
  user_name: string
  user_mail: string
  user_password: string
  user_birthday: string | null
  user_age: number | null
}

export interface FormData {
  name: string
  email: string
  password: string
  birthday: string | null
  age: number | null
}

export interface SendPayload
  extends Omit<FormData, "name" | "email" | "password" | "birthday" | "age"> {
  user_name: string
  user_mail: string
  user_password: string
  user_birthday: string | null
  user_age: number | null
}

export type ApiRoomResponse = {
  room_id: number
  room_name: string
  created_at: Date | string
  room_posts: number
}

export type LinkToProps = {
  body: ApiRoomResponse
  bodies: string
}
