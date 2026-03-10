import { prisma } from '../prisma.js'
import { NotFoundException } from '../exceptions/not-found.exception.js'
import { ForbiddenException } from '../exceptions/forbidden.exception.js'
import type { Inventory } from '@prisma/client'

export async function getOwnedInventory(
	userId: string,
	inventoryId: string,
): Promise<Inventory> {
	const inventory = await prisma.inventory.findUnique({
		where: { id: inventoryId },
	})

	if (!inventory) throw new NotFoundException()

	if (inventory.ownerId !== userId) {
		throw new ForbiddenException()
	}
	return inventory
}
