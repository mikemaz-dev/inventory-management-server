import { salesForceController } from '@/controllers/integrations/salesforce.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
import { Router } from 'express'

const router = Router()

router.post(
	'/salesforce/user',
	authMiddleware(),
	salesForceController.createIntegration.bind(salesForceController),
)
export const integrationsRouter = router
