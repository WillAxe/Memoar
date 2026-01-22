import { useState, useEffect } from "react"
import type { ApiRoomResponse } from "./static/interfaces"
import LinkTo from "./linkTo.tsx"
import "../css/user-rooms.css"

function UserRooms() {
  const userId: string = localStorage.getItem("userID")!
  const [rooms, setRooms] = useState<ApiRoomResponse[]>([])
  console.log("The user's id", userId)

  useEffect(() => {
    fetch(`/api/users/${userId}/rooms`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRooms(result.rooms)
      })
  }, [userId])
  return (
    <>
      <h1>Hello</h1>
      <section className="rooms-section-grid">
        {!rooms
          ? "Join a room or create your own and it will show up here"
          : rooms?.map((room) => (
              <div data-cy="room-card" className="room-card" key={room.room_id}>
                <h2 data-cy="room-name-card">{`${room.room_name}`}</h2>
                <LinkTo body={room} bodies="room"></LinkTo>
              </div>
            ))}
      </section>
    </>
  )
}

export default UserRooms
