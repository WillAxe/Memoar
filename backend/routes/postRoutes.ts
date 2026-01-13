import { upload } from "../middleware/upload.ts"

import express from "express"
import {
  createPost as createPostController,
  getPostsByRoomId as getPostsByRoomIdController,
} from "../controllers/postController.ts"

const router = express.Router()

// router.get("/posts", getPostsController)
// router.get("/post/:id", getPostsByIdController)
router.post("/posts", upload.single("image"), createPostController)
router.get("/rooms/:room_id/posts", getPostsByRoomIdController)

export default router
