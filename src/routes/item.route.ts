import { ItemController } from '@/controllers/inventory/item.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
import { Router } from 'express'

const router = Router()
const controller = new ItemController()

router.get('/', authMiddleware(), controller.getList.bind(controller))
router.get('/:id', authMiddleware(), controller.getById.bind(controller))

router.post('/', authMiddleware(), controller.create.bind(controller))
router.patch('/:id', authMiddleware(), controller.update.bind(controller))
router.delete('/:id', authMiddleware(), controller.delete.bind(controller))

export const itemRouter = router
