import { verifyAccessToken } from '@/utils/jwt.js'
import { prisma } from '@/utils/prisma.js'
import type { ROLE } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string
				role: ROLE
			}
		}
	}
}

export const authMiddleware =
	(requiredRole?: 'USER' | 'ADMIN') =>
	async (req: Request, res: Response, next: NextFunction) => {
		const authHandler = req.headers['authorization']
		if (!authHandler)
			return res.status(401).json({ success: false, message: 'No token' })

		const token = authHandler.split(' ')[1]
		const payload: any = verifyAccessToken(token)
		if (!payload)
			return res.status(401).json({ success: false, message: 'Invalid token' })

		const user = await prisma.user.findUnique({ where: { id: payload.id } })
		if (!user)
			return res.status(401).json({ success: false, message: 'User not found' })

		if (requiredRole && payload.role !== requiredRole) {
			return res.status(403).json({ success: false, message: 'Forbidden' })
		}

		req.user = { id: user.id, role: user.role }
		next()
	}
