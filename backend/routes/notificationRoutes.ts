import { Router } from "express"
import {
  getNotifications,
  markAsRead,
  acceptInvite,
  roomInvite,
} from "../controllers/notificationController.ts"
import { requireAuth } from "../middleware/auth.ts"

const router = Router()

router.get("/notifications", requireAuth, getNotifications)
router.post("/notifications/:id/read", requireAuth, markAsRead)
router.post("/notifications/:id/accept", requireAuth, acceptInvite)
router.post("/notifications/invite", requireAuth, roomInvite)

export default router
