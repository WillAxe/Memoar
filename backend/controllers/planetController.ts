import {
  getPlanets as getPlanetsService,
  getPlanet as getPlanetService,
} from "../services/planetService.ts"
import type { Planet } from "../services/planetService.ts"
import type { Response, Request } from "express"

export const getPlanets = async (
  _req: Request,
  res: Response<{ planets: Planet[] } | { message: string; error?: unknown }>,
): Promise<void> => {
  try {
    const planetsFromService = await getPlanetsService()
    const planets: Planet[] = planetsFromService.map((p) => ({
      planetid: p.planetid,
      planetname: p.planetname,
      planettype: p.planettype,
      mass: p.mass,
      moons: p.moons,
      distancefromsun: p.distancefromsun,
      hasrings: p.hasrings,
    }))
    res.status(200).json({ planets })
  } catch (error) {
    res.status(500).json({ message: "Failed to get planets", error })
  }
}

export const getPlanet = async (
  req: Request,
  res: Response<{ planet: Planet } | { message: string; error?: unknown }>,
): Promise<void> => {
  try {
    const planetname = req.params.planetname
    const planetFromService = await getPlanetService(String(planetname))
    const planet: Planet = {
      planetid: planetFromService.planetid,
      planetname: planetFromService.planetname,
      planettype: planetFromService.planettype,
      mass: planetFromService.mass,
      moons: planetFromService.moons,
      distancefromsun: planetFromService.distancefromsun,
      hasrings: planetFromService.hasrings,
    }
    res.status(200).json({ planet })
  } catch (error) {
    res.status(500).json({ message: "Failed to get single planet", error })
  }
}
