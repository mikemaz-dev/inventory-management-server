import type { Request, Response, NextFunction } from 'express'
import { CustomIdService } from '@/services/inventory/custom-id.service.js'

export class CustomIdController {
	private service = new CustomIdService()

	getFormat = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { inventoryId } = req.params

			const elements = await this.service.getFormat(inventoryId as string)

			res.json(elements)
		} catch (error) {
			next(error)
		}
	}

	updateFormat = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { inventoryId } = req.params
			const { elements } = req.body

			const result = await this.service.updateFormat(
				inventoryId as string,
				elements,
			)

			res.json(result)
		} catch (error) {
			next(error)
		}
	}

	generate = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { inventoryId } = req.params

			const customId = await this.service.generate(inventoryId as string)

			res.json({
				customId,
			})
		} catch (error) {
			next(error)
		}
	}
}
