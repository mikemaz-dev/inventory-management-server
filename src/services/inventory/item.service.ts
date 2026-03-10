import type {
	TCreateItemDto,
	TUpdateItemDto,
} from '@/dto/inventory/item.dto.js'
import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/client.js'
import { ForbiddenException } from '@/utils/exceptions/forbidden.exception.js'
import { NotFoundException } from '@/utils/exceptions/not-found.exception.js'
import { getAccessibleInventory } from '@/utils/inventory/getAccessibleInventory.js'
import { prisma } from '@/utils/prisma.js'
import { CustomIdService } from './custom-id.service.js'
import { FIELD_TYPE } from '@prisma/client'

const MAX_RETRIES = 5

export class ItemService {
	async getList(userId: string, inventoryId: string) {
		await getAccessibleInventory(userId, inventoryId)

		return prisma.item.findMany({
			where: { inventoryId },
			include: {
				createdBy: {
					select: {
						id: true,
						email: true,
					},
				},
				itemFieldValues: {
					include: {
						field: {
							select: {
								id: true,
								title: true,
								type: true,
								order: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getById(userId: string | null, itemId: string) {
		const item = await prisma.item.findUnique({
			where: { id: itemId },
			include: {
				inventory: true,
				createdBy: {
					select: {
						id: true,
						email: true,
					},
				},
				itemFieldValues: {
					include: {
						field: {
							select: {
								id: true,
								title: true,
								type: true,
								order: true,
							},
						},
					},
				},
			},
		})
		if (!item) throw new NotFoundException()

		if (!item.inventory.isPublic) {
			if (!userId || item.inventory.ownerId !== userId)
				throw new ForbiddenException()
		}

		return item
	}

	async create(userId: string, dto: TCreateItemDto) {
		await getAccessibleInventory(userId, dto.inventoryId)

		const customIdService = new CustomIdService()

		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			try {
				const customId = await customIdService.generate(dto.inventoryId)

				return await prisma.$transaction(async tx => {
					const item = await tx.item.create({
						data: {
							inventoryId: dto.inventoryId,
							createdById: userId,
							customId,
						},
					})

					await tx.itemFieldValue.createMany({
						data: dto.values.map(v => ({
							itemId: item.id,
							fieldId: v.fieldId,
							value: v.value,
						})),
					})

					return item
				})
			} catch (error: unknown) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === 'P2002') {
						continue
					}
					if (error.code === 'P2025') {
						throw new NotFoundException()
					}
				}
				throw error
			}
		}

		throw new Error('Failed to generate unique Custom ID')
	}

	async update(
		userId: string,
		inventoryId: string,
		itemId: string,
		dto: TUpdateItemDto,
	) {
		await getAccessibleInventory(userId, inventoryId)

		const item = await prisma.item.findUnique({
			where: { id: itemId },
		})

		if (!item || item.inventoryId !== inventoryId) {
			throw new NotFoundException()
		}

		if (!dto.values) throw new NotFoundException()

		const fields = await prisma.inventoryField.findMany({
			where: { inventoryId },
		})

		const fieldMap = new Map(fields.map(f => [f.id, f]))

		for (const value of dto.values) {
			const field = fieldMap.get(value.fieldId)
			if (!field) throw new Error('Field does not belong to inventory')

			this.validateFieldValue(field.type, value.value)
		}

		return prisma.$transaction(async tx => {
			await tx.itemFieldValue.deleteMany({
				where: { itemId },
			})

			if (!dto.values) throw new NotFoundException()

			await tx.itemFieldValue.createMany({
				data: dto.values.map(v => ({
					itemId,
					fieldId: v.fieldId,
					value: v.value,
				})),
			})

			return tx.item.findUnique({
				where: { id: itemId },
				include: { itemFieldValues: true },
			})
		})
	}

	async delete(userId: string | null, itemId: string): Promise<void> {
		const item = await prisma.item.findUnique({
			where: {
				id: itemId,
			},
			include: {
				inventory: true,
			},
		})

		if (!item) throw new NotFoundException()

		if (item.inventory.ownerId !== userId) throw new ForbiddenException()

		await prisma.item.delete({
			where: { id: itemId },
		})
	}

	private validateFieldValue(type: FIELD_TYPE, value: string) {
		switch (type) {
			case FIELD_TYPE.NUMBER:
				if (isNaN(Number(value))) {
					throw new Error('Invalid number value')
				}
				break

			case FIELD_TYPE.BOOLEAN:
				if (value !== 'true' && value !== 'false') {
					throw new Error('Invalid boolean value')
				}
				break

			case FIELD_TYPE.LINK:
				try {
					new URL(value)
				} catch (error) {
					throw new Error('Invalid URL')
				}
				break

			default:
				break
		}
	}
}
