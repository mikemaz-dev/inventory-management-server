import { salesForceService } from '@/services/integrations/salesforce.service.js'
import type { Request, Response } from 'express'

export class SalesForceController {
	async createIntegration(req: Request, res: Response) {
		try {
			const { accountName, phone, website, firstName, lastName, email } =
				req.body

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

			return res.json({ account, contact })
		} catch (error: any) {
			return res
				.status(500)
				.json({ message: error.message || 'Salesforce error' })
		}
	}
}

export const salesForceController = new SalesForceController()
