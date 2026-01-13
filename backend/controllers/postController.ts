import { createPost as createPostService } from "../services/postService.ts"
import { getPostsByRoomId as getPostsByRoomIdService } from "../services/postService.ts"
import type { Response, Request } from "express"

interface PostResponse {
  post_id: number
  user_id: number
  image_url: string
  caption: string
  created_at: Date
}

export const createPost = async (
  // req: Request,
  req: Request<
    {},
    any,
    { user_id: string; caption: string; image_url: string }
  >,
  res: Response
): Promise<void> => {
  try {
    const user_id = Number(req.body.user_id)
    const caption = req.body.caption
    if (!caption || !user_id) {
      res.status(400).json({ message: "caption and user_id is required" })
      return
    }

    if (!req.file) {
      res.status(400).json({ error: "No picture uploaded" })
      return
    }
    const image_url = `/uploads/images/${req.file.filename}`
    const post = await createPostService(user_id, caption, image_url)
    console.log(req.body)
    console.log(req.file)
    res.status(201).json({ post })
  } catch (error) {
    res.status(501).json({ message: "Error posting", error })
  }
}

//this function handles the functionality of fetching the posts for a singular room
export const getPostsByRoomId = async (
  req: Request<{ room_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const room_id = Number(req.params.room_id)
    const roomPosts = await getPostsByRoomIdService(room_id)
    res.status(200).json({ roomPosts })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts for the room", error })
  }
}
