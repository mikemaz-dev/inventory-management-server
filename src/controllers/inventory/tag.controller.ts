import type { TagService } from '@/services/inventory/tag.service.js'
import type { Request, Response } from 'express'

export class TagController {
	constructor(private tagService: TagService) {}

	search = async (req: Request, res: Response) => {
		const query = String(req.query.q ?? '')

		if (query.length < 2) {
			return res.json([])
		}

		const tags = await this.tagService.search(query)

		res.json(tags)
	}

	getInventoryTags = async (req: Request, res: Response) => {
		const { inventoryId } = req.params

		const tags = await this.tagService.getInventoryTags(inventoryId as string)

		res.json(tags)
	}

	setInventoryTags = async (req: Request, res: Response) => {
		const { inventoryId } = req.params
		const { tags } = req.body

		await this.tagService.setInventoryTags(inventoryId as string, tags)

		res.json({ success: true })
	}
}
