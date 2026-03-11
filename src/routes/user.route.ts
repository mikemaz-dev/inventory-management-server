import { UserController } from '@/controllers/user/user.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
import { Router } from 'express'

export const router = Router()
const controller = new UserController()

router.get('/me', authMiddleware(), controller.getMe.bind(controller))
router.patch('/me', authMiddleware(), controller.updateMe.bind(controller))

router.get(
	'/',
	authMiddleware('ADMIN'),
	controller.getAllUsers.bind(controller),
)
router.patch(
	'/:id/block',
	authMiddleware('ADMIN'),
	controller.blockUser.bind(controller),
)
router.patch(
	'/:id/role',
	authMiddleware('ADMIN'),
	controller.changeRole.bind(controller),
)
router.delete(
	'/:id',
	authMiddleware('ADMIN'),
	controller.deleteUser.bind(controller),
)

export const userRouter = router
