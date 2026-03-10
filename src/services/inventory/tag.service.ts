import { prisma } from '@/utils/prisma.js'
import type { Tag } from '@prisma/client'

export class TagService {
	async search(query: string): Promise<Tag[]> {
		return prisma.tag.findMany({
			where: {
				name: {
					contains: query,
					mode: 'insensitive',
				},
			},
			take: 10,
			orderBy: {
				name: 'asc',
			},
		})
	}

	async getInventoryTags(inventoryId: string): Promise<Tag[]> {
		const tags = prisma.inventoryTag.findMany({
			where: {
				inventoryId,
			},
			include: {
				tag: true,
			},
		})

		return (await tags).map(t => t.tag)
	}

	async setInventoryTags(
		inventoryId: string,
		tagNames: string[],
	): Promise<void> {
		const uniqueNames = [...new Set(tagNames)]

		await prisma.$transaction(async tx => {
			const tags = await Promise.all(
				uniqueNames.map(name =>
					tx.tag.upsert({ where: { name }, update: {}, create: { name } }),
				),
			)

			await tx.inventoryTag.deleteMany({
				where: { inventoryId },
			})

			await tx.inventoryTag.createMany({
				data: tags.map(tag => ({
					inventoryId,
					tagId: tag.id,
				})),
			})
		})
	}
}
