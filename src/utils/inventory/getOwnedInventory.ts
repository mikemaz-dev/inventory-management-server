import type { Inventory } from '@/generated/prisma/client.js'
import { prisma } from '../prisma.js'
import { NotFoundException } from '../exceptions/not-found.exception.js'
import { ForbiddenException } from '../exceptions/forbidden.exception.js'

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
