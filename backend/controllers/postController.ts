import { createPost as createPostService } from "../services/postServices.ts"
import type { Response, Request } from "express"

interface PostResponse {
  post_id: number
  user_id: number
  image_url: string
  caption: string
  created_at: Date
}

export const createPost = async (
  req: Request<
    {},
    any,
    { user_id: number; caption: string; image_url: string }
  >,
  res: Response
): Promise<void> => {
  try {
    const { user_id, caption } = req.body
    if (!caption || !user_id) {
      res.status(400).json({ message: "caption and user_id is required" })
      return
    }

    if (!req.file) {
      res.status(400).json({ error: "No picture uploaded" })
    }
    const image_url = `/uploads/images/${req.file!.filename}`
    const post = await createPostService(Number(user_id), caption, image_url)
    res.status(201).json({ post })
  } catch (error) {
    res.status(501).json({ message: "Error posting", error })
  }
}
