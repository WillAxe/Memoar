import type { Request, Response } from "express"
import {
  getNotificationsByUser,
  markNotificationAsRead,
  acceptRoomInvite,
} from "../services/notificationService.ts"

export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = req.session.userId!

    const notifications = await getNotificationsByUser(userId)
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" })
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    const notificationId = Number(req.params.id)

    if (isNaN(notificationId)) {
      return res.status(400).json({ message: "Invalid notification id" })
    }

    await markNotificationAsRead(notificationId)
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read" })
  }
}

export async function acceptInvite(req: Request, res: Response) {
  try {
    const userId = req.session.userId!
    const notificationId = Number(req.params.id)

    if (isNaN(notificationId)) {
      return res.status(400).json({ message: "Invalid notification id" })
    }

    await acceptRoomInvite(notificationId, userId)
    res.sendStatus(200)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return res.status(403).json({ message: "Unauthorized" })
    }

    res.status(500).json({ message: "Failed to accept invite" })
  }
}
