// import { Link } from "react-router-dom"

import { useState, useEffect } from "react"
import type {
  ApiUserResponse,
  FeedItem,
  Notification,
} from "./static/interfaces"
import "../css/landingpage.css"
import "./notification"
import Notifications from "./notification"

const userId: string = localStorage.getItem("userID")!

function LandingPage() {
  const [user, setUser] = useState<ApiUserResponse | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [newInvites, setNewInvites] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((response) => response.json())
      .then((result: { user: ApiUserResponse }) => {
        setUser(result.user)
      })
    fetch(`/api/user/${userId}/feed`)
      .then((response) => response.json())
      .then((result: { feed: FeedItem[] }) => {
        setFeed(result.feed)
      })

    fetch(`/api/notifications`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result: Notification[] | null) => {
        const notifications = Array.isArray(result) ? result : []
        const hasUnreadInvite: boolean = notifications.some(
          (n: Notification) => !n.is_read && !n.handled
        )
        setNewInvites(hasUnreadInvite)
        setShowSuccess(true)
      })
  }, [])

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <>
      {showSuccess && (
        <div data-cy="signup-notification-msg" className="signup-success">
          Successfully created your account!
        </div>
      )}
      <div
        data-cy="notification-inbox"
        data-has-new={newInvites}
        className={`notification-container ${newInvites ? "new-msg" : ""}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <p
          className="notification-trigger"
          onClick={(e) => {
            e.stopPropagation()
            setNotifications((prev) => !prev)
          }}
        >
          Notification
        </p>
        {isVisible && newInvites && !notifications && (
          <p className="tooltip" data-cy="notification-inbox-msg">
            You have new messages
          </p>
        )}

        {notifications && (
          <div className="notifications-popup" data-cy="notification-inbox-log">
            <Notifications />
          </div>
        )}
      </div>
      <h1>{user ? `Welcome ${user.user_name}!` : "None"}</h1>
      <main>
        <section className="start-feed">
          {!feed || (feed.length === 0 && <p>No reqent activity!</p>)}
          {feed?.map((item, index) => (
            <article key={index} className="feed-card">
              {item.type === "room-created" && (
                <>
                  <h3>New room created</h3>
                  <p>
                    You created <strong>{item.roomName}</strong>
                  </p>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </>
              )}
              {item.type === "post" && (
                <>
                  <h3>New post in {item.roomName}</h3>
                  <p>{item.content}</p>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </>
              )}
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

export default LandingPage
