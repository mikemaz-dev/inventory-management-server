import type {
	IAccountData,
	IContactData,
	ISalesforceAuthResponse,
} from '@/types/salesforce.types.js'
import axios from 'axios'

export class SalesforceService {
	private clientId = process.env.SF_CLIENT_ID!
	private clientSecret = process.env.SF_CLIENT_SECRET!
	private tokenUrl = process.env.SF_TOKEN_URL!

	private accessToken: string | null = null
	private instanceUrl: string | null = null

	private async authenticate() {
		if (this.accessToken && this.instanceUrl) return

		const params = new URLSearchParams()
		params.append('grant_type', 'client_credentials')
		params.append('client-id', this.clientId)
		params.append('client_secret', this.clientSecret)

		const res = await axios.post<ISalesforceAuthResponse>(
			this.tokenUrl,
			params,
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			},
		)

		this.accessToken = res.data.access_token
		this.instanceUrl = res.data.instance_url
	}

	async createAccount(data: IAccountData) {
		await this.authenticate()

		const res = await axios.post(
			`${this.instanceUrl}/services/data/v57.0/sobjects/Account`,
			data,
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		)

		return res.data
	}

	async createContact(data: IContactData) {
		await this.authenticate()

		const res = await axios.post(
			`${this.instanceUrl}/services/data/v57.0/sobjects/Contact`,
			data,
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		)

		return res.data
	}
}

export const salesForceService = new SalesforceService()
