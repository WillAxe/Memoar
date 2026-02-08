import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import { database } from "./database.ts"

const app = express()
const PgSession = connectPgSimple(session)

const port: number | string = process.env.PORT || 3000

import path from "path"

import userRoutes from "./routes/userRoutes.ts"
import roomRoutes from "./routes/roomRoutes.ts"
import postRoutes from "./routes/postRoutes.ts"
import feedRoutes from "./routes/feedRoutes.ts"
import notificationRoutes from "./routes/notificationRoutes.ts"
import { searchRouter } from "./routes/searchRoutes.ts"

//routes for other api's
import planetRoutes from "./routes/planetRoutes.ts"
import moonRoutes from "./routes/moonRoutes.ts"
import celestialObjectsRoutes from "./routes/celestialObjectsRoutes.ts"

app.use(
  cors({
    origin: ["http://localhost:5173", "https://willaxe.github.io"],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    store: new PgSession({
      pool: database,
      createTableIfMissing: true,
      tableName: "session",
    }),
    name: "sid",
    secret: process.env.SESSION_SECRET || "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
  })
)

app.use("/api", userRoutes)
app.use("/api", roomRoutes)
app.use("/api", postRoutes)
app.use("/api", feedRoutes)
app.use("/api/search", searchRouter)
app.use("/api", notificationRoutes)

//other api routes
app.use("/api", planetRoutes)
app.use("/api", moonRoutes)
app.use("/api", celestialObjectsRoutes)

app.use("/uploads", express.static("uploads"))

app.use(express.static(path.join(path.resolve(), "dist")))

app.listen(3000, () => {
  console.log(`Redo på http://localhost:${port}`)
})
