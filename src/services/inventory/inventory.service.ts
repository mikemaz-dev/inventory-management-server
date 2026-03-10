import type {
	TCreateInventoryDto,
	TUpdateInventoryDto,
} from '@/dto/inventory/inventory.dto.js'
import { ForbiddenException } from '@/utils/exceptions/forbidden.exception.js'
import { NotFoundException } from '@/utils/exceptions/not-found.exception.js'
import { getOwnedInventory } from '@/utils/inventory/getOwnedInventory.js'
import { prisma } from '@/utils/prisma.js'
import type { Inventory, InventoryAccess } from '@prisma/client'

interface IInventoryService {
	create(userId: string, dto: TCreateInventoryDto): Promise<Inventory>

	update(
		userId: string,
		inventoryId: string,
		dto: TUpdateInventoryDto,
	): Promise<Inventory>

	delete(userId: string, inventoryId: string): Promise<void>

	getById(userId: string | null, inventoryId: string): Promise<Inventory>
	getList(userId: string | null): Promise<Inventory[]>
}

export class InventoryService implements IInventoryService {
	async create(userId: string, dto: TCreateInventoryDto): Promise<Inventory> {
		return prisma.inventory.create({
			data: {
				...dto,
				ownerId: userId,
				imageUrl: dto.imageUrl ?? '',
				description: dto.description ?? '',
				isPublic: dto.isPublic ?? false,
			},
		})
	}

	async update(userId: string, inventoryId: string, dto: TUpdateInventoryDto) {
		const inventory = await getOwnedInventory(userId, inventoryId)

		return prisma.inventory.update({
			where: { id: inventory.id },
			data: {
				...dto,
				imageUrl: dto.imageUrl,
			},
		})
	}

	async delete(userId: string, inventoryId: string): Promise<void> {
		const inventory = await prisma.inventory.findUnique({
			where: { id: inventoryId },
		})

		if (!inventory) return

		if (inventory.ownerId !== userId) throw new ForbiddenException()

		await prisma.inventory.delete({ where: { id: inventoryId } })
	}

	async getAllWithItems() {
		return prisma.inventory.findMany({
			include: {
				owner: { select: { id: true, email: true } },
				items: {
					include: {
						createdBy: { select: { id: true, email: true } },
						itemFieldValues: {
							include: {
								field: { select: { id: true, title: true, type: true } },
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})
	}

	async getList(userId: string | null): Promise<Inventory[]> {
		return prisma.inventory.findMany({
			where: {
				OR: [
					{
						isPublic: true,
					},
					{
						...(userId && { ownerId: userId }),
					},
					{
						accesses: {
							some: {
								userId: userId ?? undefined,
							},
						},
					},
				],
			},
		})
	}

	async getById(
		userId: string | null,
		inventoryId: string,
	): Promise<Inventory> {
		const inventory = await prisma.inventory.findUnique({
			where: { id: inventoryId },
			include: {
				accesses: true,
			},
		})

		if (!inventory) throw new NotFoundException()

		if (!this.hasReadAccess(userId, inventory)) {
			throw new ForbiddenException()
		}

		return inventory
	}

	private hasReadAccess(
		userId: string | null,
		inventory: Inventory & { accesses: { userId: string }[] },
	): boolean {
		if (inventory.isPublic) return true
		if (!userId) return false
		if (inventory.ownerId === userId) return true

		return inventory.accesses.some(
			(a: { userId: string }) => a.userId === userId,
		)
	}
}
