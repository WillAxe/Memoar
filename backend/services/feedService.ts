import { database } from "../database.ts"
import type { QueryResult } from "pg"

interface FeedItem {
  type: "room-created" | "post"
  room_name: string
  created_at: Date
  content: string | null
}

export function getUserFeed(user_id: number): Promise<FeedItem[]> {
  return new Promise<FeedItem[]>((resolve, reject) => {
    const query = `
    (
    SELECT 'room-created' AS type,
    rooms.room_name,
    rooms.created_at,
    NULL AS content
    FROM rooms
    JOIN user_rooms ON user_rooms.room_id = rooms.room_id
    WHERE user_rooms.user_id = $1
    )
    UNION ALL
    (
    SELECT 'post' AS type,
    rooms.room_name,
    posts.created_at,
    posts.caption AS content
    FROM rooms
    JOIN user_rooms ON user_rooms.room_id = rooms.room_id
    JOIN posts ON posts.room_id = rooms.room_id
    WHERE user_rooms.user_id = $1
    )
    ORDER BY created_at DESC
    `
    database.query<FeedItem>(
      query,
      [user_id],
      (err: Error, res: QueryResult<FeedItem>) => {
        if (err) {
          reject(err)
        } else resolve(res.rows)
      }
    )
  })
}
