import "express"
import "express-session"
declare global {
  namespace Express {
    interface User {
      id: number
    }

    interface Request {
      user: User
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number
  }
}
