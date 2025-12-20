import { database } from "../database.ts"
import type { QueryResult } from "pg"

interface Notification {
  notification_id: number
  user_id: number
  room_id: number
  invite_text: string | null
  is_read: boolean
  handled: boolean
  sent_at: Date
}

export async function getNotificationsByUser(
  userId: number
): Promise<Notification[]> {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
      AND handled = false
    ORDER BY sent_at DESC
  `

  const result = await database.query<Notification>(query, [userId])
  return result.rows
}

export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE notification_id = $1
  `
  await database.query(query, [notificationId])
}

export async function acceptRoomInvite(
  notificationId: number,
  userId: number
): Promise<void> {
  await database.query("BEGIN")

  try {
    const notificationResult = await database.query<Notification>(
      "SELECT * FROM notifications WHERE notification_id = $1",
      [notificationId]
    )

    const notification = notificationResult.rows[0]

    if (!notification) {
      throw new Error("Notification not found")
    }

    if (notification.user_id !== userId) {
      throw new Error("Unauthorized")
    }

    if (notification.handled) {
      throw new Error("Invite already handled")
    }

    await database.query(
      "INSERT INTO user_rooms (room_id, user_id) VALUES ($1, $2)",
      [notification.room_id, userId]
    )

    await database.query(
      "UPDATE notifications SET handled = true WHERE notification_id = $1",
      [notificationId]
    )

    await database.query("COMMIT")
  } catch (error) {
    await database.query("ROLLBACK")
    throw error
  }
}

export async function createRoomInvite(
  invitedUserId: number,
  roomId: number,
  text: string
) {
  await database.query(
    `
    INSERT INTO notifications (user_id, room_id, invite_text)
    VALUES ($1, $2, $3)
  `,
    [invitedUserId, roomId, text]
  )
}
