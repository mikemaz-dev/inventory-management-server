import { UserService } from '@/services/user/user.service.js'
import { ROLE } from '@prisma/client'
import { type Request, type Response } from 'express'

export class UserController {
	async getMe(req: Request, res: Response) {
		try {
			const userId = req.user!.id
			const user = await UserService.getById(userId)

			return res.json({ success: true, data: user })
		} catch (error: any) {
			return res.status(404).json({
				success: false,
				message: error.message,
			})
		}
	}

	async updateMe(req: Request, res: Response) {
		try {
			const userId = req.user!.id
			const { username, avatar } = req.body

			const updated = await UserService.updateProfile(userId, {
				username,
				avatar,
			})

			return res.json({ success: true, data: updated })
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await UserService.getAll()
			return res.json({ success: true, data: users })
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			})
		}
	}

	async blockUser(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { isBlocked } = req.body

			const updated = await UserService.blockUser(id as string, isBlocked)

			return res.json({ success: true, data: updated })
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	}

	async changeRole(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { role } = req.body

			if (!Object.values(ROLE).includes(role)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid role',
				})
			}

			const updated = await UserService.changeRole(id as string, role)

			return res.json({ success: true, data: updated })
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	}
}
