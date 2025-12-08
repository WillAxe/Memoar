import { database } from "../database.ts"
import type { QueryResult } from "pg"

interface Post {
  post_id: number
  user_id: number
  image_url: string
  caption: string
  created_at: Date
}

export function createPost(
  user_id: number,
  caption: string,
  image_url: string
): Promise<Post> {
  return new Promise<Post>((resolve, reject) => {
    const query =
      "INSERT INTO posts(user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *"
    database.query<Post>(
      query,
      [user_id, caption, image_url],
      (err: Error, res: QueryResult<Post>) => {
        if (err) reject(err)
        else {
          resolve(res.rows[0]!)
        }
      }
    )
  })
}
