import { CustomIdController } from '@/controllers/inventory/custom-id.controller.js'
import { Router } from 'express'

export const router = Router()
const controller = new CustomIdController()

router.get('/:inventoryId', controller.getFormat)

router.patch('/:inventoryId', controller.updateFormat)

router.post('/:inventoryId/generate', controller.generate)

export const inventoryCustomIdRouter = router