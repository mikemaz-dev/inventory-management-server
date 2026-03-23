import { Router } from 'express'
import { salesForceController } from '@/controllers/integrations/salesforce.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'

const router = Router()

router.get(
	'/salesforce/auth',
	authMiddleware('USER'),
	salesForceController.getAuthUrl.bind(salesForceController),
)

router.get(
	'/oauth/callback',
	salesForceController.handleCallback.bind(salesForceController),
)

router.post(
	'/salesforce/user',
	authMiddleware('USER'),
	salesForceController.createIntegration.bind(salesForceController),
)

export const integrationsRouter = router
