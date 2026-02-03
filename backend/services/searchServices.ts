import { database } from "../database.ts"
import type { QueryResult } from "pg"

export interface UserSearchResult {
  user_id: number
  user_name: string
}

//Function to handle the database query for searching users by name when inviting a user to a room, using the SQL LIKE operator for partial matches and excluding the current user
export function searchUsersByName(
  searchQuery: string,
  currentUserId: number
): Promise<UserSearchResult[]> {
  return new Promise<UserSearchResult[]>((resolve, reject) => {
    const query = `
    SELECT user_name, user_mail, user_id FROM users WHERE (user_name LIKE $1) AND user_id != $2 LIMIT 15 `

    //Using parameterized queries to prevent SQL injection and sql wildcards for the matching
    database.query<UserSearchResult>(
      query,
      [`%${searchQuery}%`, currentUserId],
      (err: Error, res: QueryResult<UserSearchResult>) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.rows)
        }
      }
    )
  })
}
