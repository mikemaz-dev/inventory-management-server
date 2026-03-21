import { salesForceService } from '@/services/integrations/salesforce.service.js'
import type { Request, Response } from 'express'

export class SalesForceController {
	async createIntegration(req: Request, res: Response) {
		try {
			const { accountName, phone, website, firstName, lastName, email } =
				req.body

			if (!accountName || !firstName || !lastName) {
				return res.status(400).json({
					message: 'Missing required fields: accountName, firstName, lastName',
				})
			}

			const account = await salesForceService.createAccount({
				Name: accountName,
				Phone: phone,
				Website: website,
			})

			const contact = await salesForceService.createContact({
				FirstName: firstName,
				LastName: lastName,
				Email: email,
				AccountId: account.id,
			})

			return res.status(201).json({
				success: true,
				data: { account, contact },
			})
		} catch (error: any) {
			console.error('❌ SalesForceController error:', error.message)

			if (error.message?.includes('INVALID_FIELD')) {
				return res.status(400).json({ message: 'Invalid field in request' })
			}
			if (error.message?.includes('INSUFFICIENT_ACCESS')) {
				return res
					.status(403)
					.json({ message: 'Insufficient permissions in Salesforce' })
			}
			if (error.message?.includes('auth') || error.message?.includes('token')) {
				return res
					.status(503)
					.json({ message: 'Salesforce authentication failed' })
			}

			return res.status(500).json({
				message: error.message || 'Salesforce integration error',
			})
		}
	}
}

export const salesForceController = new SalesForceController()
