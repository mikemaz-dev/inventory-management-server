import type { Response } from 'express'

export function errorIdentify(error: unknown, res: Response) {
	if (error instanceof Error) {
		return res.status(400).json({
			success: false,
			message: error.message,
		})
	}

	return res.status(400).json({
		success: false,
		message: 'Unknown error',
	})
}
