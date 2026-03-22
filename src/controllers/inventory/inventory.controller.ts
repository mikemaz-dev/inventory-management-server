import {
	createInventorySchema,
	updateInventorySchema,
} from '@/schemas/inventory.schema.js'
import { InventoryService } from '@/services/inventory/inventory.service.js'
import type { NextFunction, Request, Response } from 'express'

const inventoryService = new InventoryService()

export class InventoryController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id

			const dto = createInventorySchema.parse(req.body)

			const inventory = await inventoryService.create(userId, dto)

			res.status(200).json(inventory)
		} catch (error) {
			next(error)
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { id } = req.params

			const dto = updateInventorySchema.parse(req.body)

			const inventory = await inventoryService.update(userId, id as string, dto)

			res.status(201).json(inventory)
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { id } = req.params

			await inventoryService.delete(userId, id as string)

			res.status(204).send()
		} catch (error) {
			next(error)
		}
	}

	async getAllWithItems(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await inventoryService.getAllWithItems()
			res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async getList(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id ?? null

			const inventories = await inventoryService.getList(userId)

			res.json(inventories)
		} catch (error) {
			next(error)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id ?? null
			const { id } = req.params

			const inventory = await inventoryService.getById(userId, id as string)

			res.json(inventory)
		} catch (error) {
			next(error)
		}
	}
}
