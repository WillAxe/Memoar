import { Client } from "pg"
import dotenv from "dotenv"
dotenv.config()

export const database = new Client({
  connectionString: process.env.PGURI,
})

database.connect()
