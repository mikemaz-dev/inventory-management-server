import { TagController } from '@/controllers/inventory/tag.controller.js'
import { TagService } from '@/services/inventory/tag.service.js'
import { Router } from 'express'

const router = Router()

const tagService = new TagService()
const tagController = new TagController(tagService)

router.get('/search', tagController.search)

router.get('/inventories/:inventoryId', tagController.getInventoryTags)

router.post('/inventories/:inventoryId', tagController.setInventoryTags)

export const tagRouter = router
