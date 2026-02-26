import type {
	createInventorySchema,
	updateInventorySchema,
} from '@/schemas/inventory.schema.js'
import type z from 'zod'

export type TCreateInventoryDto = z.infer<typeof createInventorySchema>
export type TUpdateInventoryDto = z.infer<typeof updateInventorySchema>

export const InventoryCategoryEnum = {
	Books: 'Books',
	Electronics: 'Electronics',
	Furniture: 'Furniture',
	Other: 'Other',
} as const

export type InventoryCategoryEnum =
	(typeof InventoryCategoryEnum)[keyof typeof InventoryCategoryEnum]
