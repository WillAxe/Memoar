import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
const app = express()

const port: number | string = process.env.PORT || 3000

import path from "path"

import userRoutes from "./routes/userRoutes.ts"
import roomRoutes from "./routes/roomRoutes.ts"
import postRoutes from "./routes/postRoutes.ts"
import feedRoutes from "./routes/feedRoutes.ts"

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", userRoutes)
app.use("/api", roomRoutes)
app.use("/api", postRoutes)
app.use("/api", feedRoutes)

// app.use(express.static(path.join(path.resolve(), "dist")))
app.use(express.static("public"))

app.get("*", (_req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

app.use("/uploads", express.static("uploads"))

app.listen(3000, () => {
  console.log(`Redo på http://localhost:${port}`)
})
