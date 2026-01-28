import express from "express"
import {
  getMoons as getAllMoons,
  getMoon as getMoonByName,
} from "../controllers/moonController.ts"

const router = express.Router()
// Get all moons
router.get("/moons", getAllMoons)
// Get single moon by name
router.get("/moons/:moonname", getMoonByName)

export default router
