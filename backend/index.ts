import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
const app = express()

const port = process.env.PORT || 3000

import path from "path"
import userRoutes from "./routes/userRoutes.ts"
// import postRoutes from "./routes/postRoutes.ts"

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", userRoutes)
// app.use("/api", postRoutes)

app.use(express.static(path.join(path.resolve(), "dist")))

app.listen(3000, () => {
  console.log(`Redo på http://localhost:/3000`)
})
