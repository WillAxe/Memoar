import { useState, useEffect } from "react"
import type { ApiRoomResponse } from "./static/interfaces"

function Room() {
  const roomId = localStorage.getItem("roomID")
  const [room, setRoom] = useState<ApiRoomResponse>()
  useEffect(() => {
    fetch(`/api/room/${roomId}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRoom(result.room)
      })
  }, [roomId])
  return (
    <>
      <h1>{room?.room_name}</h1>
      <section>
        <div className="posts-grid">
          <div className="img-post-card">
            <img />
          </div>
        </div>
        <div>
          <form>
            <input type="file"></input>
          </form>
        </div>
      </section>
    </>
  )
}
export default Room
