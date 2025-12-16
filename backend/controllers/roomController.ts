import {
  getRoomById as getRoomByIdService,
  createRoom as createRoomService,
  getRoomsForUser as getRoomsForUserService,
} from "../services/roomService.ts"
import type { Response, Request } from "express"

interface RoomResponse {
  room_id: number
  room_name: string
  created_at: Date
  room_posts: number | null
}

export const getRoomById = async (
  req: Request,
  res: Response<{ room: RoomResponse } | { message: string; error?: unknown }>
): Promise<void> => {
  try {
    const roomId = req.params.id
    const roomFromDb = await getRoomByIdService(Number(roomId))
    const room: RoomResponse = {
      room_id: roomFromDb!.room_id,
      room_name: roomFromDb!.room_name,
      created_at: roomFromDb!.created_at,
      room_posts: roomFromDb!.room_posts,
    }
    res.status(200).json({ room })
  } catch (error) {
    res.status(500).json({ message: "Error getting the room", error })
  }
}

export const createRoom = async (
  req: Request<{}, any, { room_name: string; user_id: number }>,
  res: Response
): Promise<void> => {
  try {
    const { room_name, user_id } = req.body

    if (!room_name || typeof user_id !== "number") {
      res.status(400).json({ message: "room_name and user_id are required" })
      return
    }

    const room = await createRoomService(room_name, user_id)
    res.status(201).json(room)
  } catch (error) {
    res.status(500).json({ message: "Error creating a room", error })
  }
}

export const getRoomsForUser = async (
  req: Request,
  res: Response<{ rooms: RoomResponse[] } | { error: string }>
): Promise<void> => {
  const userId = Number(req.params.id)

  try {
    const roomsFromDb = await getRoomsForUserService(userId)
    const rooms: RoomResponse[] = roomsFromDb.map((room) => ({
      room_id: room.room_id,
      room_name: room.room_name,
      created_at: room.created_at,
      room_posts: (room as RoomResponse).room_posts ?? null,
    }))

    res.status(200).json({ rooms })
  } catch (err) {
    res.status(500).json({ error: "Internal server error getting rooms" })
  }
}
