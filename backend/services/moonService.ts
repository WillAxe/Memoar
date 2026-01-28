import { database } from "../database.ts"
import type { QueryResult } from "pg"

export interface Moon {
  moonid: number
  moonname: string
  moonplanetid: number
}

export function getMoons(): Promise<Moon[]> {
  return new Promise<Moon[]>((resolve, reject) => {
    const query = "SELECT * FROM Moons"
    database.query(query, (err: Error | null, res: QueryResult<Moon>) => {
      if (err) reject(err)
      else {
        resolve(res.rows)
      }
    })
  })
}

export function getMoon(moonname: string): Promise<Moon> {
  return new Promise<Moon>((resolve, reject) => {
    const query = "SELECT * FROM Moons WHERE MoonName = $1;"
    database.query(query, [moonname], (err: Error | null, res: QueryResult) => {
      if (err) reject(err)
      else {
        resolve(res.rows[0])
      }
    })
  })
}
