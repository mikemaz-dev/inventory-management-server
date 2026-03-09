import type {
	TCreateInventoryFieldDto,
	TUpdateInventoryFieldDto,
} from '@/dto/inventory/inventory-field.dto.js'
import { ForbiddenException } from '@/utils/exceptions/forbidden.exception.js'
import { NotFoundException } from '@/utils/exceptions/not-found.exception.js'
import { getAccessibleInventory } from '@/utils/inventory/getAccessibleInventory.js'
import { prisma } from '@/utils/prisma.js'

export class InventoryFieldService {
	async getList(userId: string | null, inventoryId: string) {
		const inventory = await prisma.inventory.findUnique({
			where: { id: inventoryId },
		})

		if (!inventory) throw new NotFoundException()

		if (!inventory.isPublic && inventory.ownerId !== userId) {
			throw new ForbiddenException()
		}

		return prisma.inventoryField.findMany({
			where: { inventoryId },
			orderBy: { order: 'asc' },
		})
	}

	async getById(userId: string | null, fieldId: string) {
		const field = await prisma.inventoryField.findUnique({
			where: {
				id: fieldId,
			},
			include: {
				inventory: true,
			},
		})

		if (!field) throw new NotFoundException()

		if (
			!field.inventory.isPublic &&
			(!userId || field.inventory.ownerId !== userId)
		) {
			throw new ForbiddenException()
		}

		return field
	}

	async create(userId: string, dto: TCreateInventoryFieldDto) {
		await getAccessibleInventory(userId, dto.inventoryId)

		const lastField = await prisma.inventoryField.findFirst({
			where: { inventoryId: dto.inventoryId },
			orderBy: { order: 'desc' },
		})

		const nextOrder = lastField ? lastField.order + 1 : 1

		return prisma.inventoryField.create({
			data: {
				inventoryId: dto.inventoryId,
				type: dto.type,
				title: dto.title,
				description: dto.description || '',
				showInTable: dto.showInTable ?? false,
				order: nextOrder,
			},
		})
	}

	async update(userId: string, fieldId: string, dto: TUpdateInventoryFieldDto) {
		const field = await prisma.inventoryField.findUnique({
			where: {
				id: fieldId,
			},
			include: {
				inventory: true,
			},
		})

		if (!field) throw new NotFoundException()
		if (field.inventory.ownerId !== userId) throw new ForbiddenException()

		if (!dto) throw new Error('No data was provided')

		return prisma.inventoryField.update({
			where: { id: fieldId },
			data: {
				...(dto.title && { title: dto.title }),
				...(dto.description && { description: dto.description }),
				...(dto.type && { type: dto.type }),
				...(dto.showInTable !== undefined && { showInTable: dto.showInTable }),
				...(dto.order && { order: dto.order }),
			},
		})
	}

	async delete(userId: string, fieldId: string) {
		const field = await prisma.inventoryField.findUnique({
			where: { id: fieldId },
			include: { inventory: true },
		})

		await getAccessibleInventory(userId, field?.inventoryId as string)

		if (!field) throw new NotFoundException()
		if (field.inventory.ownerId !== userId) throw new ForbiddenException()

		await prisma.inventoryField.delete({ where: { id: fieldId } })
	}
}
