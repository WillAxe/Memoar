import express from "express"
import { getUserFeed as getUserFeedController } from "../controllers/feedController.ts"

const router = express.Router()

router.get("/user/:id/feed", getUserFeedController)

export default router
