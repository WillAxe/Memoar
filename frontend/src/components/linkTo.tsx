import { Link } from "react-router-dom"
import type { ApiRoomResponse } from "./static/interfaces"

export type LinkToProps = {
  body: ApiRoomResponse
  bodies: string
}

function LinkTo({ body, bodies }: LinkToProps) {
  const roomId = body.room_id
  localStorage.setItem("roomID", roomId.toString())
  return (
    <>
      <Link to={`/landingpage/${bodies}/${roomId}`}>Click here</Link>
    </>
  )
}
export default LinkTo
