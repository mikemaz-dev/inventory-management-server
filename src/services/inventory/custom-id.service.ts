import { CustomIdSchema } from '@/schemas/custom-id.schema.js'
import { IdElementTypeEnum } from '@/types/customid.types.js'
import { prisma } from '@/utils/prisma.js'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class CustomIdService {
	async getFormat(inventoryId: string) {
		const format = await prisma.customIdFormat.findUnique({
			where: { inventoryId },
		})

		if (!format) {
			return []
		}

		return CustomIdSchema.parse(format.elements)
	}

	async updateFormat(inventoryId: string, elements: unknown) {
		const parsed = CustomIdSchema.parse(elements)

		return prisma.customIdFormat.upsert({
			where: { inventoryId },
			update: { elements: parsed },
			create: {
				inventoryId,
				elements: parsed,
			},
		})
	}

	async generate(inventoryId: string): Promise<string> {
		const format = await prisma.customIdFormat.findUnique({
			where: { inventoryId },
		})

		if (!format) {
			throw new Error('Custom id not configured')
		}

		const elements = CustomIdSchema.parse(format.elements)

		return prisma.$transaction(async tx => {
			const parts: string[] = []

			for (const element of elements) {
				switch (element.type) {
					case IdElementTypeEnum.FixedText:
						parts.push(element.type)
						break

					case IdElementTypeEnum.Random20Bit:
						parts.push(String(Math.floor(Math.random() * 2 ** 20)))
						break

					case IdElementTypeEnum.Random32Bit:
						parts.push(String(Math.floor(Math.random() * 2 ** 32)))
						break

					case IdElementTypeEnum.Random6Digit:
						parts.push(
							this.pad(
								Math.floor(Math.random() * 1_000_000),
								element.padding ?? 6,
							),
						)
						break

					case IdElementTypeEnum.Guid:
						parts.push(randomUUID())
						break

					case IdElementTypeEnum.DateTime:
						parts.push(dayjs().format(element.format))
						break

					case IdElementTypeEnum.Sequence:
						const seq = await tx.inventorySequence.upsert({
							where: { inventoryId },
							update: { value: { increment: 1 } },
							create: { inventoryId, value: 1 },
						})

						parts.push(this.pad(seq.value, element.padding ?? 1))
						break
				}
			}

			return parts.join('')
		})
	}

	private pad(value: number, length: number) {
		return String(value).padStart(length, '0')
	}
}
