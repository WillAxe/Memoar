import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

export const database = new Pool({
  connectionString: process.env.PGURI,
})
