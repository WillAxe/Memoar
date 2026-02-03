import {
  getMoons as getMoonsService,
  getMoon as getMoonService,
} from "../services/moonService.ts"

import type { Moon } from "../services/moonService.ts"
import type { Response, Request } from "express"

export const getMoons = async (
  _req: Request,
  res: Response<{ moons: Moon[] } | { message: string; error?: unknown }>
): Promise<void> => {
  try {
    const moonsFromService = await getMoonsService()
    const moons: Moon[] = moonsFromService.map((m) => ({
      moonid: m.moonid,
      moonname: m.moonname,
      moonplanetid: m.moonplanetid,
    }))
    res.status(200).json({ moons })
  } catch (error) {
    res.status(500).json({ message: "Failed to get moons from service", error })
  }
}

export const getMoon = async (
  req: Request,
  res: Response<{ moon: Moon } | { message: string; error?: unknown }>
): Promise<void> => {
  try {
    const moonname = req.params.moonname
    const moonFromService = await getMoonService(String(moonname))
    const moon: Moon = {
      moonid: moonFromService.moonid,
      moonname: moonFromService.moonname,
      moonplanetid: moonFromService.moonplanetid,
    }
    res.status(200).json({ moon })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get single moon by name", error })
  }
}
