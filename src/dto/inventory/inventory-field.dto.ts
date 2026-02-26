import z from 'zod'

export const InventoryFieldTypeEnum = {
	SINGLE_LINE: 'SINGLE_LINE',
	MULTI_LINE: 'MULTI_LINE',
	NUMBER: 'NUMBER',
	LINK: 'LINK',
	BOOLEAN: 'BOOLEAN',
} as const

export type InventoryFieldTypeEnum =
	(typeof InventoryFieldTypeEnum)[keyof typeof InventoryFieldTypeEnum]

export const createInventoryFieldSchema = z.object({
	inventoryId: z.uuid(),
	type: z.enum(InventoryFieldTypeEnum),
	title: z.string().min(1).max(100),
	description: z.string(),
	showInTable: z.boolean(),
	order: z.number(),
})

export const updateInventoryFieldSchema = z
	.object({
		type: z.enum(InventoryFieldTypeEnum),
		title: z.string().min(1).max(100),
		description: z.string(),
		showInTable: z.boolean(),
		order: z.number(),
	})
	.optional()

export type TCreateInventoryFieldDto = z.infer<typeof createInventoryFieldSchema>
export type TUpdateInventoryFieldDto = z.infer<typeof updateInventoryFieldSchema>
