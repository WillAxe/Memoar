import "../css/new-room.css"
import { useState } from "react"
import type { RoomFormData } from "./static/interfaces"

function NewRoom() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<RoomFormData>({
    room_name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev: RoomFormData) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userId = localStorage.getItem("userID")

    const response: Response = await fetch(`/api/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_name: formData.room_name,
        user_id: Number(userId),
      }),
    })

    const result = await response.json()
    console.log(result)
  }

  return (
    <>
      <main>
        <div onClick={() => setIsVisible(!isVisible)}>Create a new room</div>
        {isVisible && (
          <form
            data-cy="create-room-form"
            onSubmit={handleSubmit}
            className="create-new-form"
          >
            <label htmlFor="room">Room Name:</label>
            <input
              data-cy="room-name-input"
              type="text"
              name="room_name"
              onChange={handleChange}
            />
            <button data-cy="submit-data-btn" type="submit">
              Create room!
            </button>
          </form>
        )}
      </main>
    </>
  )
}
export default NewRoom
