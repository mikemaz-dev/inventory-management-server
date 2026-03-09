import { InventoryFieldController } from '@/controllers/inventory/inventory-field.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
import { Router } from 'express'

const router = Router()
const controller = new InventoryFieldController()

router.get('/', authMiddleware(), controller.getList.bind(controller))

router.get('/:id', authMiddleware(), controller.getById.bind(controller))

router.post('/', authMiddleware(), controller.create.bind(controller))
router.patch('/:id', authMiddleware(), controller.update.bind(controller))
router.delete('/:id', authMiddleware(), controller.delete.bind(controller))

export const inventoryFieldRouter = router
