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
			console.error('SF Error Full:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
				config: {
					url: error.config?.url,
					method: error.config?.method,
					hasPassword: !!error.config?.data?.includes('password'),
				},
			})

			return res.status(500).json({
				message: error.message,
				sfError: error.response?.data || 'No SF response',
				sfStatus: error.response?.status,
				hint: 'Check Render env vars: SF_USERNAME, SF_PASSWORD (pass+token), grant_type=password',
			})
		}
	}
}

export const salesForceController = new SalesForceController()
