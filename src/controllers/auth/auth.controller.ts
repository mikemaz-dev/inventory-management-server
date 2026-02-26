import { AuthService } from '@/services/auth/auth.service.js'
import { errorIdentify } from '@/utils/error-identify.js'
import { loginSchema, registerSchema } from '@/schemas/auth.schema.js'
import { type Request, type Response } from 'express'

export class AuthController {
	async register(req: Request, res: Response) {
		try {
			const data = registerSchema.parse(req.body)
			const result = await AuthService.register(data)

			return res.status(201).json({
				success: true,
				data: result,
			})
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({
					success: false,
					message: error.message,
				})
			} else {
				return res
					.status(400)
					.json('An unknown error occurred that is not an instance of Error')
			}
		}
	}

	async login(req: Request, res: Response) {
		try {
			const data = loginSchema.parse(req.body)
			const result = await AuthService.login(data)

			return res.json({ success: true, ...result })
		} catch (error) {
			errorIdentify(error, res)
		}
	}

	async refresh(req: Request, res: Response) {
		try {
			const { token } = req.body
			const result = await AuthService.refreshToken(token)

			return res.json({ success: true, ...result })
		} catch (error) {
			errorIdentify(error, res)
		}
	}
}
