import { ForbiddenException } from '../exceptions/forbidden.exception.js'
import { NotFoundException } from '../exceptions/not-found.exception.js'
import { prisma } from '../prisma.js'

export async function getAccessibleInventory(
	userId: string | null,
	inventoryId: string,
) {
	const inventory = await prisma.inventory.findUnique({
		where: {
			id: inventoryId,
		},
	})

	if (!inventory) throw new NotFoundException()

	if (inventory.isPublic) return inventory

	if (!userId || inventory.ownerId !== userId) throw new ForbiddenException()

	return inventory
}
