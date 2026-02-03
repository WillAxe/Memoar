import { database } from "../database.ts"
import type { QueryResult } from "pg"

export interface CelestialObject {
  objectid: number
  objectname: string
  objecttype: string
}

export function getCelestialObjects(): Promise<CelestialObject[]> {
  return new Promise<CelestialObject[]>((resolve, reject) => {
    const query = "SELECT * FROM CometsAndAsteroids"
    database.query(
      query,
      (err: Error | null, res: QueryResult<CelestialObject>) => {
        if (err) reject(err)
        else {
          resolve(res.rows)
        }
      }
    )
  })
}

export function getCelestialObject(
  objectname: string
): Promise<CelestialObject> {
  return new Promise<CelestialObject>((resolve, reject) => {
    const query = "SELECT * FROM CometsAndAsteroids WHERE ObjectName = $1;"
    database.query(
      query,
      [objectname],
      (err: Error | null, res: QueryResult) => {
        if (err) reject(err)
        else {
          resolve(res.rows[0])
        }
      }
    )
  })
}
