import axios, { AxiosError } from 'axios'
import type {
	IAccountData,
	IContactData,
	ISalesforceAuthResponse,
	ISalesforceError,
} from '@/types/salesforce.types.js'

export class SalesforceService {
	private clientId = process.env.SF_CLIENT_ID!
	private clientSecret = process.env.SF_CLIENT_SECRET!
	private redirectUri = process.env.SF_REDIRECT_URI!
	private authUrl = 'https://test.salesforce.com/services/oauth2/authorize'
	private tokenUrl = 'https://test.salesforce.com/services/oauth2/token'

	private accessToken: string | null = null
	private refreshToken: string | null = null
	private instanceUrl: string | null = null

	getAuthUrl(): string {
		const params = new URLSearchParams({
			response_type: 'code',
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			scope: 'refresh_token full api',
		})
		return `${this.authUrl}?${params.toString()}`
	}

	async handleOAuthCallback(code: string): Promise<void> {
		console.log({
			tokenUrl: this.tokenUrl,
			username: process.env.SF_USERNAME,
			passwordLength: process.env.SF_PASSWORD?.length,
		})

		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: this.clientId,
			client_secret: this.clientSecret,
			redirect_uri: this.redirectUri,
		})

		const res = await axios.post<ISalesforceAuthResponse>(
			this.tokenUrl,
			params,
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				timeout: 10_000,
			},
		)

		this.accessToken = res.data.access_token
		this.refreshToken = res.data.refresh_token ?? null
		this.instanceUrl = res.data.instance_url?.replace(/\/$/, '')

		console.log('Salesforce OAuth success:', {
			instanceUrl: this.instanceUrl,
			tokenPreview: this.accessToken?.slice(0, 20) + '...',
		})
	}

	async refreshAccessToken(): Promise<void> {
		if (!this.refreshToken) throw new Error('No refresh token')

		const params = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: this.refreshToken,
			client_id: this.clientId,
			client_secret: this.clientSecret,
		})

		const res = await axios.post<ISalesforceAuthResponse>(
			this.tokenUrl,
			params,
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				timeout: 10_000,
			},
		)

		this.accessToken = res.data.access_token
		this.instanceUrl = res.data.instance_url?.replace(/\/$/, '')
	}

	private async request<T>(
		method: 'get' | 'post' | 'patch',
		endpoint: string,
		data?: any,
	): Promise<T> {
		if (!this.accessToken) await this.refreshAccessToken()

		try {
			const res = await axios[method]<T>(
				`${this.instanceUrl}${endpoint}`,
				data,
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
						'Content-Type': 'application/json',
					},
					timeout: 15_000,
				},
			)
			return res.data
		} catch (error: any) {
			const err = error as AxiosError
			const sfErrors = Array.isArray(err.response?.data)
				? (err.response.data as ISalesforceError[])
				: [err.response?.data as ISalesforceError].filter(Boolean)

			const message =
				sfErrors.map(e => e.message || e.errorCode).join(', ') ||
				'Unknown Salesforce error'
			throw new Error(message)
		}
	}

	async createAccount(data: IAccountData) {
		return this.request<{ id: string; success: boolean }>(
			'post',
			'/services/data/v57.0/sobjects/Account',
			data,
		)
	}

	async createContact(data: IContactData) {
		return this.request<{ id: string; success: boolean }>(
			'post',
			'/services/data/v57.0/sobjects/Contact',
			data,
		)
	}
}

export const salesForceService = new SalesforceService()
