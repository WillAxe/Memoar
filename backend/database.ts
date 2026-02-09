import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

export const database = new Pool({
  connectionString: process.env.PGURI,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2500,
})

// Handle pool errors
database.on("error", (err) => {
  console.error("Unexpected database pool error:", err)
})
