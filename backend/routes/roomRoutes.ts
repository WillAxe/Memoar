import express from "express"
import {
  getRoomById as getRoomByIdController,
  getRoomsForUser as getRoomsForUserController,
  createRoom as createRoomController,
} from "../controllers/roomController.ts"

const router = express.Router()

router.get("/room/:id", getRoomByIdController)
router.get("/users/:id/rooms", getRoomsForUserController)
router.post("/rooms", createRoomController)

export default router
