import { AuthController } from '@/controllers/auth/auth.controller.js'
import { Router } from 'express'

const router = Router()

const authController = new AuthController()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authController.refresh)

export const authRouter = router
