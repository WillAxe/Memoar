import express from "express"
import {
  getUserById as getUserByIdController,
  getUsers as getUsersController,
  createUser as createUserController,
  loginUser as loginUserController,
} from "../controllers/userController.ts"
const router = express.Router()

// Get all users
router.get("/users", getUsersController)
router.get("/user/:id", getUserByIdController)
router.post("/users", createUserController)
router.post("/login", loginUserController)

export default router
