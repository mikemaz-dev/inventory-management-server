import {
	createInventoryFieldSchema,
	updateInventoryFieldSchema,
} from '@/dto/inventory/inventory-field.dto.js'
import { InventoryFieldService } from '@/services/inventory/inventory-field.service.js'
import type { Request, Response, NextFunction } from 'express'

const inventoryFieldService = new InventoryFieldService()

export class InventoryFieldController {
	async getList(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id

			const inventoryFields = await inventoryFieldService.getList(userId)

			res.status(200).json(inventoryFields)
		} catch (error) {
			next(error)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { id } = req.params

			const inventoryField = inventoryFieldService.getById(userId, id as string)

			res.status(200).json(inventoryField)
		} catch (error) {
			next(error)
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id

			const dto = createInventoryFieldSchema.parse(req.body)

			const inventoryField = await inventoryFieldService.create(userId, dto)

			res.status(200).json(inventoryField)
		} catch (error) {
			next(error)
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { fieldId } = req.params

			const dto = updateInventoryFieldSchema.parse(req.body)

			const inventoryField = inventoryFieldService.update(
				userId,
				fieldId as string,
				dto,
			)

			res.status(200).json(inventoryField)
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const { id: fieldId } = req.params

			await inventoryFieldService.delete(userId, fieldId as string)

			res.status(204).send()
		} catch (error) {
			next(error)
		}
	}
}
