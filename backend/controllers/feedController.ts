import { getUserFeed as getUserFeedService } from "../services/feedService.ts"
import type { Response, Request } from "express"
interface FeedItemResponse {
  type: "room-created" | "post"
  roomName: string
  createdAt: string
  content: string | null
}

export const getUserFeed = async (
  req: Request,
  res: Response<{ feed: FeedItemResponse[] } | { error: string }>
): Promise<void> => {
  try {
    const userId = Number(req.params.id)
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user iD" })
      return
    }
    const feedFromDb = await getUserFeedService(Number(userId))
    const feed: FeedItemResponse[] = feedFromDb.map((item) => ({
      type: item.type as "room-created" | "post",
      roomName: item.room_name,
      createdAt: new Date(item.created_at).toISOString(),
      content: item.content,
    }))
    res.json({ feed })
  } catch (error) {
    console.error("Error loading feed:", error)
    res.status(500).json({ error: "Could not load feed" })
  }
}
