import { database } from "../database.ts"
import { Query, type QueryResult } from "pg"

interface Post {
  post_id: number
  user_id: number
  image_url: string
  caption: string
  created_at: Date
}

interface Room {
  room_id: number
  posts: Post[]
}

export function createPost(
  user_id: number,
  caption: string,
  image_url: string,
  room_id: number
): Promise<Post> {
  return new Promise<Post>((resolve, reject) => {
    const query =
      "INSERT INTO posts(user_id, image_url, caption, room_id) VALUES ($1, $2, $3, $4) RETURNING *"
    database.query<Post>(
      query,
      [user_id, caption, image_url, room_id],
      (err: Error, res: QueryResult<Post>) => {
        if (err) reject(err)
        else {
          resolve(res.rows[0]!)
        }
      }
    )
  })
}

export function getPostsByRoomId(room_id: number): Promise<Post[]> {
  return new Promise<Post[]>((resolve, reject) => {
    const query = "SELECT * FROM posts WHERE room_id = $1;"
    database.query<Post>(query, [room_id], (err, res: QueryResult<Post>) => {
      if (err) reject(err)
      else {
        resolve(res.rows)
        console.log(res.rows)
      }
    })
  })
}
