import { createItemSchema, updateItemSchema } from '@/dto/inventory/item.dto.js'
import { ItemService } from '@/services/inventory/item.service.js'
import type { NextFunction, Request, Response } from 'express'

export const itemService = new ItemService()

export class ItemController {
	async getList(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { inventoryId } = req.query as { inventoryId: string }

			const items = await itemService.getList(userId, inventoryId as string)

			res.status(200).json(items)
		} catch (error) {
			next(error)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?.id ?? null
			const { id } = req.params

			const item = await itemService.getById(userId, id as string)

			res.status(200).json(item)
		} catch (error) {
			next(error)
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?.id

			const dto = createItemSchema.parse(req.body)

			const item = await itemService.create(userId as string, dto)

			res.status(200).json(item)
		} catch (error) {
			next(error)
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { inventoryId, itemId } = req.params

			const dto = updateItemSchema.parse(req.body)

			const item = await itemService.update(
				userId,
				inventoryId as string,
				itemId as string,
				dto,
			)

			res.status(200).json(item)
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { id } = req.params

			await itemService.delete(userId, id as string)

			res.status(204).send()
		} catch (error) {
			next(error)
		}
	}
}
