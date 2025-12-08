import { upload } from "../middleware/upload.ts"

import express from "express"
import {
  createPost as createPostController,
  // getPosts as getPostsController,
  // getPostById as getPostByIdController,
} from "../controllers/postController.ts"

const router = express.Router()

// router.get("/posts", getPostsController)
// router.get("/post/:id", getPostsByIdController)
router.post("/posts", upload.single("image"), createPostController)

export default router
