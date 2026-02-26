import type {
	TCreateInventoryFieldDto,
	TUpdateInventoryFieldDto,
} from '@/dto/inventory/inventory-field.dto.js'
import { ForbiddenException } from '@/utils/exceptions/forbidden.exception.js'
import { NotFoundException } from '@/utils/exceptions/not-found.exception.js'
import { getAccessibleInventory } from '@/utils/inventory/getAccessibleInventory.js'
import { prisma } from '@/utils/prisma.js'

export class InventoryFieldService {
	async getList(userId: string) {
		return prisma.inventoryField.findMany({
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

		return prisma.inventoryField.create({
			data: {
				inventoryId: dto.inventoryId,
				type: dto.type,
				title: dto.title,
				description: dto.description || '',
				showInTable: dto.showInTable ?? false,
				order: dto.order ?? 1,
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
				title: dto.title,
				description: dto.description,
				type: dto.type,
				showInTable: dto.showInTable,
				order: dto.order,
			},
		})
	}

	async delete(userId: string, fieldId: string) {
		const field = await prisma.inventoryField.findUnique({
			where: { id: fieldId },
			include: { inventory: true },
		})

		if (!field) throw new NotFoundException()
		if (field.inventory.ownerId !== userId) throw new ForbiddenException()

		await prisma.inventoryField.delete({ where: { id: fieldId } })
	}
}
