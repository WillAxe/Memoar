import { useState, useEffect } from "react"
import type { ApiRoomResponse } from "./static/interfaces"
import LinkTo from "./linkTo.tsx"

const userId: string = localStorage.getItem("userID")!
function UserRooms() {
  const [rooms, setRooms] = useState<ApiRoomResponse[]>([])

  useEffect(() => {
    fetch(`/api/users/${userId}/rooms`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRooms(result.rooms)
      })
  }, [])
  return (
    <>
      <h1>Hello</h1>
      <section>
        {rooms.map((room) => (
          <div className="roomCard" key={room.room_id}>
            <h2>{`${room.room_name}`}</h2>
            <LinkTo body={room} bodies="room"></LinkTo>
          </div>
        ))}
      </section>
    </>
  )
}

export default UserRooms
