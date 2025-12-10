import { useState, useEffect } from "react"
import type { ApiRoomResponse } from "./static/interfaces"

function Room() {
  const roomId = localStorage.getItem("roomID")
  const [room, setRoom] = useState<ApiRoomResponse>()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")

  const userId = localStorage.getItem("userID")!

  async function upload() {
    try {
      if (!file) {
        console.log("No file selected")
        return
      }
      const formData = new FormData()
      formData.append("image", file)
      formData.append("caption", caption)
      formData.append("user_id", userId)
      console.log(formData)
      const response = await fetch(`/api/posts`, {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Upload success", data)
      } else {
        console.error("Upload failed", response.status, await response.text())
      }
    } catch (error) {
      console.log(error)
    }
  }
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
          <form
            encType="multipart/form-data"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <textarea onChange={(e) => setCaption(e.target.value)} />
            <button type="button" onClick={upload}>
              Upload post
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
export default Room
