import { database } from "../database.ts"
import type { QueryResult } from "pg"

interface Room {
  room_id: number
  room_name: string
  created_at: Date
  room_posts: number | null
}

export function getRoomById(id: number) {
  return new Promise<Room | null>((resolve, reject) => {
    const query = "SELECT * FROM rooms WHERE room_id = $1"
    database.query(query, [id], (err: Error, res: QueryResult) => {
      if (err) {
        reject(err)
      } else {
        resolve((res.rows[0] as Room) || null)
      }
    })
  })
}

export function createRoom(room_name: string, user_id: number): Promise<Room> {
  return new Promise<Room>((resolve, reject) => {
    const insertRoomQuery =
      "INSERT INTO rooms(room_name) VALUES ($1) RETURNING room_id, room_name, created_at"

    database.query<Room>(
      insertRoomQuery,
      [room_name],
      (err: Error, res: QueryResult<Room>) => {
        if (err) {
          reject(err)
        } else {
          const createdRoom = res.rows[0]!

          // Insert creator into user_rooms
          const insertUserRoomQuery =
            "INSERT INTO user_rooms(user_id, room_id) VALUES ($1, $2) RETURNING user_room_id"

          database.query(
            insertUserRoomQuery,
            [user_id, createdRoom.room_id],
            (err2: Error, _res2: QueryResult) => {
              if (err2) {
                reject(err2)
              } else {
                resolve(createdRoom)
              }
            }
          )
        }
      }
    )
  })
}

export function getRoomsForUser(user_id: number): Promise<Room[]> {
  return new Promise<Room[]>((resolve, reject) => {
    const query = `SELECT rooms.room_id, rooms.room_name, rooms.created_at FROM rooms JOIN user_rooms ON rooms.room_id = user_rooms.room_id WHERE user_rooms.user_id = $1`
    database.query<Room>(
      query,
      [user_id],
      (err: Error, res: QueryResult<Room>) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.rows)
        }
      }
    )
  })
}
