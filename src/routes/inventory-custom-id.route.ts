import { Router } from 'express'
import { CustomIdController } from '@/controllers/inventory/custom-id.controller.js'

const router = Router()
const controller = new CustomIdController()

router.get('/:inventoryId', controller.getFormat)

router.patch('/:inventoryId', controller.updateFormat)

router.post('/:inventoryId/generate', controller.generate)

export const inventoryCustomId = router