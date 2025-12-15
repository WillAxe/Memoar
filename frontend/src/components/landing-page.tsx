// import { Link } from "react-router-dom"

import { useState, useEffect } from "react"
import type { ApiUserResponse, FeedItem } from "./static/interfaces"

const userId: string = localStorage.getItem("userID")!

function LandingPage() {
  const [user, setUser] = useState<ApiUserResponse | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])
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
  }, [])

  return (
    <>
      <h1>{user ? `Welcome ${user.user_name}!` : "None"}</h1>
      <main>
        <section className="start-feed">
          {!feed || (feed.length === 0 && <p>No reqent activity!</p>)}
          {feed.map((item, index) => (
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
