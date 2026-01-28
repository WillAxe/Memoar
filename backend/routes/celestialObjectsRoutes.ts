import express from "express"
import {
  getCelestialObjects as getAllCelestialObjects,
  getCelestialObject as getCelestialObjectByName,
} from "../controllers/celestialObjectsController.ts"

const router = express.Router()
// Get all celestial objects
router.get("/celestialobjects", getAllCelestialObjects)
// Get single celestial object by name
router.get("/celestialobjects/:objectname", getCelestialObjectByName)

export default router
