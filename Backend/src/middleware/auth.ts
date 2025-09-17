import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
