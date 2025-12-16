import type { Request, Response } from "express"
import { database } from "../database.ts"
import {
  getNotificationsByUser,
  markNotificationAsRead,
  acceptRoomInvite,
  createRoomInvite,
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

export async function roomInvite(req: Request, res: Response): Promise<void> {
  try {
    const inviterUserId = req.session.userId

    if (!inviterUserId) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const { invitedUserId, roomId, invite_text } = req.body

    if (!invitedUserId || !roomId) {
      res.status(400).json({ message: "You must enter a valid user id" })
      return
    }

    // Check if invited user exists
    const userCheck = await database.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [invitedUserId]
    )
    if (userCheck.rows.length === 0) {
      res.status(400).json({ message: "Invalid user ID" })
      return
    }

    await createRoomInvite(
      Number(invitedUserId),
      Number(roomId),
      invite_text || "You have been invited to a room"
    )

    res.status(201).json({ message: "Invitation sent" })
  } catch (error) {
    res.status(500).json({ message: "Failed to send invitation", error })
  }
}
