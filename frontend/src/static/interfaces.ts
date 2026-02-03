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

export interface SendPayload extends Omit<
  FormData,
  "name" | "email" | "password" | "birthday" | "age"
> {
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
}

export type FeedItem = {
  type: "room-created" | "post"
  roomName: string
  createdAt: string
  content?: string
}

export interface RoomFormData {
  room_name: string
}

export interface InviteFormData {
  user_id: number
  room_id: number
  invite_text: string
}

export type Notification = {
  notification_id: number
  user_id: number
  room_id: number
  invite_text: string | null
  is_read: boolean
  handled: boolean
  sent_at: string
}

export type ApiPostResponse = {
  post_id: number
  user_id: number
  room_id: number
  image_url: string
  caption: string | null
  created_at: string
}

export type SearchResult = {
  user_id: number
  user_name: string
  user_mail: string
}
