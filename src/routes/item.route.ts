import { Router } from 'express'
import { ItemController } from '@/controllers/inventory/item.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

export const router = Router({ mergeParams: true })
export const controller = new ItemController()

router.get('/', authMiddleware(), controller.getList)
router.post('/', authMiddleware(), controller.create)

router.get('/:id', authMiddleware(), controller.getById)

export const itemRouter = router
