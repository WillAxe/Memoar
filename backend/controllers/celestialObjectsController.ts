import {
  getCelestialObjects as getCelestialObjectsService,
  getCelestialObject as getCelestialObjectService,
} from "../services/celestialObjectsService.ts"

import type { CelestialObject } from "../services/celestialObjectsService.ts"
import type { Response, Request } from "express"

export const getCelestialObjects = async (
  _req: Request,
  res: Response<
    { objects: CelestialObject[] } | { message: string; error?: unknown }
  >,
): Promise<void> => {
  try {
    const ObjectsFromService = await getCelestialObjectsService()
    const objects: CelestialObject[] = ObjectsFromService.map((o) => ({
      objectid: o.objectid,
      objectname: o.objectname,
      objecttype: o.objecttype,
    }))
    res.status(200).json({ objects })
  } catch (error) {
    res.status(500).json({ message: "Failed to get objects", error })
  }
}

export const getCelestialObject = async (
  req: Request,
  res: Response<
    { object: CelestialObject } | { message: string; error?: unknown }
  >,
): Promise<void> => {
  try {
    const objectname = req.params.objectname
    const objectFromService = await getCelestialObjectService(
      String(objectname),
    )
    const object: CelestialObject = {
      objectid: objectFromService.objectid,
      objectname: objectFromService.objectname,
      objecttype: objectFromService.objecttype,
    }
    res.status(200).json({ object })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get single object from service", error })
  }
}
