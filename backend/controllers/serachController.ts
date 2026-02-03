import type { Request, Response } from "express"
import { searchUsersByName as searchUsersByNameService } from "../services/searchServices.ts"
import type { UserSearchResult } from "../services/searchServices.ts"

export const searchUsers = async (
  req: Request,
  res: Response<{ users: UserSearchResult[] } | { message: string }>,
): Promise<void> => {
  try {
    const { query } = req.query
    const currentUserId = req.session.userId

    if (!currentUserId) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Invalid query" })
      return
    }

    if (query.length < 2) {
      res.status(200).json({ users: [] })
      return
    }

    const users = await searchUsersByNameService(query, currentUserId)
    res.status(200).json({ users })
  } catch (error) {
    console.error("Error searching users:", error)
    res.status(500).json({ message: "Error searching users" })
  }
}
