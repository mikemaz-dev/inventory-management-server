import z from 'zod'

export const createItemSchema = z.object({
	inventoryId: z.uuid(),
	values: z.array(
		z.object({
			fieldId: z.uuid(),
			value: z.string(),
		}),
	),
})

export const updateItemSchema = z.object({
	values: z
		.array(
			z.object({
				fieldId: z.uuid(),
				value: z.string(),
			}),
		)
		.optional(),
})

export type TCreateItemDto = z.infer<typeof createItemSchema>
export type TUpdateItemDto = z.infer<typeof updateItemSchema>
