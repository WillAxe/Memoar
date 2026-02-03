import { database } from "../database.ts"
import type { QueryResult } from "pg"

export interface Planet {
  planetid: number
  planetname: string
  planettype: string
  mass: string
  moons: number
  distancefromsun: number
  hasrings: boolean
}

export function getPlanets(): Promise<Planet[]> {
  return new Promise<Planet[]>((resolve, reject) => {
    const query = "SELECT * FROM Planets;"
    database.query(query, (err: Error | null, res: QueryResult<Planet>) => {
      if (err) reject(err)
      else {
        resolve(res.rows)
      }
    })
  })
}

export function getPlanet(planetname: string): Promise<Planet> {
  return new Promise<Planet>((resolve, reject) => {
    const query = "SELECT * FROM Planets WHERE PlanetName = $1;"
    database.query(
      query,
      [planetname],
      (err: Error | null, res: QueryResult<Planet>) => {
        if (err) reject(err)
        else {
          resolve(res.rows[0] as Planet)
        }
      }
    )
  })
}
