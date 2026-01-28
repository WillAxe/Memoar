import express from "express"
import {
  getPlanets as getAllPlanets,
  getPlanet as getPlanetByName,
} from "../controllers/planetController.ts"

const router = express.Router()
// Get all planets
router.get("/planets", getAllPlanets)
// Get single planet by name
router.get("/planets/:planetname", getPlanetByName)

export default router
