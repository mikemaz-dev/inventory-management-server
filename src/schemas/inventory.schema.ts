import { InventoryCategoryEnum } from '@/dto/inventory/inventory.dto.js'
import z from 'zod'

export const createInventorySchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().max(100).optional(),
	category: z.enum(InventoryCategoryEnum),
	imageUrl: z.url().optional(),

	isPublic: z.boolean().optional(),
})

export const updateInventorySchema = createInventorySchema.partial()
