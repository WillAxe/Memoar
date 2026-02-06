import { useState, useEffect, useRef, useCallback } from "react"
import type { ApiRoomResponse, ApiPostResponse } from "../static/interfaces"
import SearchBar from "../components/search-bar"
import "../css/room.css"

function Room() {
  const [roomId, setRoomId] = useState<string>(localStorage.getItem("roomID")!)
  const [room, setRoom] = useState<ApiRoomResponse>()
  const [posts, setPosts] = useState<ApiPostResponse[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [activePost, setActivePost] = useState<ApiPostResponse | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [inviteText, setInviteText] = useState<string>("")

  const userId = localStorage.getItem("userID")!

  // Check localStorage on every render and update roomId if needed
  useEffect(() => {
    const checkRoomId = () => {
      const stored = localStorage.getItem("roomID")
      if (stored && stored !== roomId) {
        setRoomId(stored)
        setPosts([])
        setRoom(undefined)
      }
    }

    checkRoomId()
    const handleFocus = () => checkRoomId()
    const handleRoomChange = () => checkRoomId()

    window.addEventListener("focus", handleFocus)
    window.addEventListener("roomChanged", handleRoomChange)

    // Poll every 700ms to catch changes quickly
    const interval = setInterval(checkRoomId, 700)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("roomChanged", handleRoomChange)
      clearInterval(interval)
    }
  }, [roomId])

  // Update invite text when room changes
  useEffect(() => {
    setInviteText(`You have been invited to join room ${roomId}`)
  }, [roomId])

  const inviteDialogRef = useRef<HTMLDialogElement | null>(null)
  const postDialogRef = useRef<HTMLDialogElement | null>(null)
  const imageDialogRef = useRef<HTMLDialogElement | null>(null)

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
        fetchPosts()
        setFile(null)
        setCaption("")
        // Reset the file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement
        if (fileInput) fileInput.value = ""
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
  const fetchPosts = useCallback(() => {
    fetch(`/api/rooms/${roomId}/posts`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Posts in room:", result)
        if (
          result.roomPosts === undefined ||
          result.roomPosts === null ||
          result.roomPosts.length === 0
        ) {
          setPosts([])
          return
        }
        setPosts(result.roomPosts)
      })
  }, [roomId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
  const handleUsersSelected = useCallback((userIds: number[]) => {
    setSelectedUserIds(userIds)
  }, [])

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedUserIds.length === 0) {
      alert("Please select at least one user to invite")
      return
    }

    console.log("Selected user IDs:", selectedUserIds)
    console.log("Room ID:", roomId)

    // Send invites to all selected users
    Promise.all(
      selectedUserIds.map((userId) => {
        const payload = {
          invitedUserId: Number(userId),
          roomId: Number(roomId),
          invite_text: inviteText,
        }
        console.log("Sending invite payload:", payload)
        return fetch("/api/notifications/invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        })
      })
    )
      .then(async (responses) => {
        // Check each response for errors
        for (const res of responses) {
          if (!res.ok) {
            const errorData = await res.json()
            console.error("Invite failed:", errorData)
          }
        }

        const allSuccessful = responses.every((res) => res.ok)
        if (allSuccessful) {
          inviteDialogRef.current?.close()
          setSelectedUserIds([])
          alert(`Successfully invited ${selectedUserIds.length} user(s)`)
        } else {
          alert("Some invitations failed to send. Check console for details.")
        }
      })
      .catch((error) => {
        console.error("Error sending invites:", error)
        alert("Error sending invitations")
      })
  }

  function openInviteForm() {
    inviteDialogRef.current?.showModal()
  }

  function closeInviteForm() {
    inviteDialogRef.current?.close()
  }

  // Functions that handle the expansion and closing of the post and image modals
  function openPost(post: ApiPostResponse) {
    setActivePost(post)
    postDialogRef.current?.showModal()
  }

  function closePost() {
    postDialogRef.current?.close()
    setActivePost(null)
  }

  function expandImage(src: string) {
    setActiveImage(src)
    imageDialogRef.current?.showModal()
  }

  function closeImage() {
    imageDialogRef.current?.close()
    setActiveImage(null)
  }

  return (
    <>
      <h1 data-cy="room-name-title">{room?.room_name}</h1>
      <section className="main-content-layout">
        <div className="posts-grid">
          {posts?.length === 0
            ? "No posts yet in this room. Be the first to upload!"
            : posts?.map((post) => (
                <div
                  className="post-card"
                  onClick={() => openPost(post)}
                  key={post.post_id}
                >
                  <img src={post.image_url} alt="Post image" />
                  <div className="post-content">
                    <p className="caption">{post.caption}</p>
                    <span>
                      <small>
                        Posted:{" "}
                        {new Date(post.created_at).toLocaleString()}{" "}
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
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
            />
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

        <dialog ref={inviteDialogRef} className="invite-dialog">
          <button
            className="close-btn"
            aria-label="Close Modal"
            onClick={closeInviteForm}
          >
            X
          </button>
          <h2>Invite users to room</h2>
          <form onSubmit={handleInviteSubmit} className="invite-form">
            <label>Search and select users to invite</label>
            <SearchBar onUsersSelected={handleUsersSelected} />

            <label htmlFor="inviteText">Invite message</label>
            <textarea
              name="inviteText"
              value={inviteText}
              onChange={(e) => setInviteText(e.target.value)}
            />
            <button
              className="send-btn"
              type="submit"
              disabled={selectedUserIds.length === 0}
            >
              Send invite{selectedUserIds.length > 1 ? "s" : ""}
            </button>
          </form>
        </dialog>
      </section>

      {/* This handles the click and make the post popup as modal  */}
      <dialog ref={postDialogRef} className="post-dialog">
        <button
          className="close-btn"
          aria-label="Close post"
          onClick={closePost}
        >
          ✕
        </button>

        {activePost && (
          <div className="post-dialog-content">
            <img
              src={activePost.image_url}
              alt="image"
              className="post-dialog-image clickable-image"
              onClick={() => expandImage(activePost.image_url)}
            />

            <div className="post-dialog-caption">
              <p>{activePost.caption}</p>
            </div>
          </div>
        )}
      </dialog>

      <dialog ref={imageDialogRef} className="image-dialog">
        <button
          className="close-btn image-close"
          aria-label="Close image"
          onClick={closeImage}
        >
          ✕
        </button>

        {activeImage && (
          <img
            src={activeImage}
            alt="Fullscreen"
            className="image-dialog-img"
          />
        )}
      </dialog>
    </>
  )
}
export default Room
