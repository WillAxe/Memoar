import { Link } from "react-router-dom"
import type { ApiRoomResponse } from "./static/interfaces"

export type LinkToProps = {
  body: ApiRoomResponse
  bodies: string
}

const userId: string = localStorage.getItem("userID")!

function LinkTo({ body, bodies }: LinkToProps) {
  const roomId = body.room_id
  localStorage.setItem("roomID", roomId.toString())
  return (
    <>
      <Link
        to={`/landingpage/${userId}/${bodies}/${roomId}`}
        data-cy="link-to-specific-room"
      >
        Click here
      </Link>
    </>
  )
}
export default LinkTo
