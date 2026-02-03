import { Router } from "express"
import { searchUsers } from "../controllers/serachController.ts"

export const searchRouter = Router()

// GET /api/search/users?query=john
searchRouter.get("/users", searchUsers)
