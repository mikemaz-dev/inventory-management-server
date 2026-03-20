import { IdElementTypeEnum } from '@/types/customid.types.js'
import { z } from 'zod'

const BaseElementSchema = z.object({
	id: z.string(),
	type: z.enum(IdElementTypeEnum),
})

const FixedTextSchema = BaseElementSchema.extend({
	type: z.literal(IdElementTypeEnum.FixedText),
	value: z.string(),
})

const NumberElementSchema = BaseElementSchema.extend({
	padding: z.number().optional(),
})

const DateTimeSchema = BaseElementSchema.extend({
	type: z.literal(IdElementTypeEnum.DateTime),
	format: z.string(),
})

export const CustomIdSchema = z.array(
	z.union([
		FixedTextSchema,
		NumberElementSchema.extend({
			type: z.literal(IdElementTypeEnum.Random6Digit),
		}),
		NumberElementSchema.extend({
			type: z.literal(IdElementTypeEnum.Sequence),
		}),
		DateTimeSchema,
		BaseElementSchema.extend({
			type: z.literal(IdElementTypeEnum.Guid),
		}),
		BaseElementSchema.extend({
			type: z.literal(IdElementTypeEnum.Random20Bit),
		}),
		BaseElementSchema.extend({
			type: z.literal(IdElementTypeEnum.Random32Bit),
		}),
	]),
)
