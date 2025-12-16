import { Router } from "express"
import {
  getNotifications,
  markAsRead,
  acceptInvite,
} from "../controllers/notificationController.ts"
import { requireAuth } from "../middleware/auth.ts"

const router = Router()

router.get("/notifications", requireAuth, getNotifications)
router.post("/:id/read", requireAuth, markAsRead)
router.post("/:id/accept", requireAuth, acceptInvite)

export default router
