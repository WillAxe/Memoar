// import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import type {
  ApiUserResponse,
  FeedItem,
  Notification,
} from "../static/interfaces"
import "../css/landingpage.css"
import "../components/notification"
import Notifications from "../components/notification"

function LandingPage() {
  const { userId } = useParams()
  const [user, setUser] = useState<ApiUserResponse | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [newInvites, setNewInvites] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  useEffect(() => {
    const userId: string = localStorage.getItem("userID")!
    if (!userId) return
    fetch(`/api/user/${userId}`)
      .then((response) => response.json())
      .then((result: { user: ApiUserResponse }) => {
        setUser(result.user)
      })
    fetch(`/api/user/${userId}/feed`)
      .then((response) => response.json())
      .then((result: { feed: FeedItem[] | null }) => {
        console.log(result.feed)
        setFeed(Array.isArray(result.feed) ? result.feed : [])
      })

    fetch(`/api/notifications`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result: Notification[] | null) => {
        const notifications = Array.isArray(result) ? result : []
        const hasUnreadInvite: boolean = notifications.some(
          (n: Notification) => !n.is_read && !n.handled,
        )
        setNewInvites(hasUnreadInvite)
        setShowSuccess(true)
      })
  }, [userId])

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
      <h1 data-cy="h1-title">{user ? `Welcome ${user.user_name}!` : "None"}</h1>
      <main>
        <section data-cy="recent-activity-feed" className="start-feed">
          {feed?.length === 0 && (
            <p data-cy="no-activity">No recent activity!</p>
          )}
          {feed?.map((item, index) => (
            <article
              data-cy="activity-feed-card"
              key={index}
              className="feed-card"
            >
              <h3 data-cy="feed-title">
                {" "}
                {item.type === "room-created" && "New room created"}{" "}
                {item.type === "post" && "New post in"}
              </h3>
              <p data-cy="activity-info">
                {item.type === "room-created" && (
                  <>
                    You created <strong>{item.roomName}</strong>
                  </>
                )}
                {""}
                {item.type === "post" && `${item.content}`}
              </p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

export default LandingPage
