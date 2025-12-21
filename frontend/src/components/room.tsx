import { useState, useEffect } from "react"
import type { ApiRoomResponse } from "./static/interfaces"

function Room() {
  const roomId = localStorage.getItem("roomID")
  const [room, setRoom] = useState<ApiRoomResponse>()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [invitedUser, setInvitedUser] = useState<string>("")
  const [inviteText, setInviteText] = useState<string>(
    "You have been invited to join this room"
  )

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
        credentials: "include",
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
    fetch(`/api/room/${roomId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setRoom(result.room)
      })
  }, [roomId])

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault()
    const userId = parseInt(invitedUser)
    if (isNaN(userId) || !roomId) {
      alert("Please enter a valid user ID")
      return
    }
    fetch("/api/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        invitedUserId: userId,
        roomId: parseInt(roomId),
        invite_text: inviteText,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Invitation sent successfully")
          setInvitedUser("")
        } else {
          alert("Failed to send invitation")
        }
      })
      .catch((error) => {
        console.error("Error sending invite:", error)
        alert("Error sending invitation")
      })
  }
  return (
    <>
      <h1 data-cy="room-name-title">{room?.room_name}</h1>
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
      <button>Invite to room</button>
      <form onSubmit={handleInviteSubmit}>
        <label htmlFor="user">Enter the user id to invite</label>
        <input
          data-cy="invite-user-input"
          name="user"
          type="text"
          value={invitedUser}
          onChange={(e) => setInvitedUser(e.target.value)}
        />
        <label htmlFor="inviteText">Invite message</label>
        <textarea
          name="inviteText"
          value={inviteText}
          onChange={(e) => setInviteText(e.target.value)}
        />
        <button type="submit">Send invite</button>
      </form>
    </>
  )
}
export default Room
