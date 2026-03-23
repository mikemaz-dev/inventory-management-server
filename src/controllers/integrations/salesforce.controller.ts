import type { Request, Response } from 'express'
import { salesForceService } from '@/services/integrations/salesforce.service.js'

export class SalesForceController {
	getAuthUrl(req: Request, res: Response) {
		const url = salesForceService.getAuthUrl()
		res.json({ url })
	}

	async handleCallback(req: Request, res: Response) {
		try {
			const { code } = req.query
			if (!code || typeof code !== 'string')
				return res.status(400).send('Missing code')

			await salesForceService.handleOAuthCallback(code)
			return res.send(
				'Salesforce connected successfully! You can close this page.',
			)
		} catch (err: any) {
			console.error('Salesforce callback error:', err)
			return res.status(500).send('Salesforce connection failed')
		}
	}

	async createIntegration(req: Request, res: Response) {
		try {
			const { accountName, phone, website, firstName, lastName, email } =
				req.body
			if (!accountName || !firstName || !lastName)
				return res.status(400).json({ message: 'Missing required fields' })

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

			return res.status(201).json({ success: true, data: { account, contact } })
		} catch (err: any) {
			console.error('Salesforce integration error:', err)
			return res.status(500).json({ success: false, message: err.message })
		}
	}
}

export const salesForceController = new SalesForceController()
