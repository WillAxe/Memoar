import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
const app = express()

const port: number | string = process.env.PORT || 3000

import path from "path"
app.use("/uploads", express.static("uploads"))

import userRoutes from "./routes/userRoutes.ts"
import roomRoutes from "./routes/roomRoutes.ts"

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", userRoutes)
app.use("/api", roomRoutes)

app.use(express.static(path.join(path.resolve(), "dist")))

app.listen(3000, () => {
  console.log(`Redo på http://localhost:${port}`)
})
