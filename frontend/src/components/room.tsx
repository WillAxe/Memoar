import { useState, useEffect, useRef } from "react"
import type { ApiRoomResponse, ApiPostResponse } from "./static/interfaces"
import "../css/room.css"

function Room() {
  const roomId = localStorage.getItem("roomID")!
  const [room, setRoom] = useState<ApiRoomResponse>()
  const [posts, setPosts] = useState<ApiPostResponse[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [invitedUser, setInvitedUser] = useState<string>("")
  const [inviteText, setInviteText] = useState<string>(
    "You have been invited to join this room"
  )

  const userId = localStorage.getItem("userID")!
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  async function upload() {
    try {
      if (!file) {
        console.log("No file selected")
        return
      }
      const formData = new FormData()
      formData.append("user_id", userId)
      formData.append("room_id", roomId)
      formData.append("image", file)
      formData.append("caption", caption)
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

  //Fetch call for fetching posts and handling the response
  useEffect(() => {
    fetch(`/api/rooms/${roomId}/posts`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Posts in room:", result)
        setPosts(result.roomPosts)
      })
  }, [roomId])

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault()
    const userId = parseInt(invitedUser)
    if (isNaN(userId) || !roomId) {
      alert("Please enter a valid user ID")
      return
    }
    fetch("/api/notifications/invite", {
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
          //Close the dialog modal after inviting
          dialogRef.current?.close()
          setInvitedUser("")
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

  function openInviteForm() {
    dialogRef.current?.showModal()
  }

  function closeInviteForm() {
    dialogRef.current?.close()
  }

  return (
    <>
      <h1 data-cy="room-name-title">{room?.room_name}</h1>
      <section className="main-content-layout">
        <div className="posts-grid">
          {posts?.length === 0
            ? "No posts yet in this room. Be the first to upload!"
            : posts?.map((post) => (
                <div className="post-card" key={post.post_id}>
                  <img src={post.image_url} alt="Post image" />
                  <div className="post-content">
                    <p className="caption">{post.caption}</p>
                    <span>
                      <small>
                        Posted: {new Date(post.created_at).toLocaleString()}{" "}
                      </small>
                    </span>
                  </div>
                </div>
              ))}
        </div>
        <div className="upload-post-form">
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
      <section className="invite-card">
        <button className="open-dialog-btn" onClick={openInviteForm}>
          Invite user to room
        </button>

        <dialog ref={dialogRef} className="invite-dialog">
          <button
            className="close-btn"
            aria-label="Close Modal"
            onClick={closeInviteForm}
          >
            X
          </button>
          <h2>Invite user</h2>
          <form onSubmit={handleInviteSubmit} className="invite-form">
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
            <button className="send-btn" type="submit">
              Send invite
            </button>
          </form>
        </dialog>
      </section>
    </>
  )
}
export default Room
