import { useState, useEffect, useCallback } from "react"
import type { Notification } from "./static/interfaces"

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  async function acceptInvite(notificationId: number) {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/accept`,
        {
          method: "POST",
          credentials: "include",
        }
      )
      if (response.ok) {
        alert("Invite accepted")
        fetchNotifications()
      } else {
        alert("Failed to accept invite")
      }
    } catch (error) {
      console.error("Error accepting invite:", error)
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "POST",
          credentials: "include",
        }
      )
      if (response.ok) {
        fetchNotifications()
      } else {
        alert("Failed to mark as read")
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  return (
    <div className="notifications-wrapper">
      {!notifications || notifications?.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications?.map((notice) => (
            <li key={notice.notification_id}>
              <p className="text">{notice.invite_text}</p>
              <p className="text">Room ID: {notice.room_id}</p>
              <p className="text">
                Sent at: {new Date(notice.sent_at).toLocaleString()}
              </p>
              {!notice.is_read && (
                <button
                  className="notification-actions"
                  onClick={() => markAsRead(notice.notification_id)}
                >
                  Mark as Read
                </button>
              )}
              {notice.invite_text && !notice.handled && (
                <button
                  className="notification-actions"
                  onClick={() => acceptInvite(notice.notification_id)}
                >
                  Accept Invite
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
