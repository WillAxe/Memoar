import { useState, useEffect, useCallback } from "react"
import type { ApiRoomResponse } from "../static/interfaces"
import LinkTo from "../components/linkTo"
import "../css/user-rooms.css"

function UserRooms() {
  const userId: string = localStorage.getItem("userID")!
  const [rooms, setRooms] = useState<ApiRoomResponse[]>([])
  console.log("The user's id", userId)

  const fetchRooms = useCallback(() => {
    fetch(`/api/users/${userId}/rooms`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRooms(result.rooms)
      })
  }, [userId])

  useEffect(() => {
    fetchRooms()
    //Listens for the custom event dispacthed when a new room is created
    const handleRoomCreated = () => {
      fetchRooms()
    }
    window.addEventListener("roomCreated", handleRoomCreated)

    return () => {
      window.removeEventListener("roomCreated", handleRoomCreated)
    }
  }, [fetchRooms])
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
