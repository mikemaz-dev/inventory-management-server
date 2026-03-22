import type {
	IAccountData,
	IContactData,
	ISalesforceAuthResponse,
	ISalesforceError,
} from '@/types/salesforce.types.js'
import axios, { AxiosError } from 'axios'

export class SalesforceService {
	private clientId = process.env.SF_CLIENT_ID!
	private clientSecret = process.env.SF_CLIENT_SECRET!
	private tokenUrl = process.env.SF_TOKEN_URL!

	private accessToken: string | null = null
	private instanceUrl: string | null = null
	private authPromise: Promise<void> | null = null

	private async authenticate(): Promise<void> {
		if (this.accessToken && this.instanceUrl) return

		if (this.authPromise) return this.authPromise

		this.authPromise = this.doAuthenticate()
		return this.authPromise
	}

	private async doAuthenticate(): Promise<void> {
		const params = new URLSearchParams()
		params.append('grant_type', 'password')
		params.append('client_id', this.clientId)
		params.append('client_secret', this.clientSecret)
		params.append('username', process.env.SF_USERNAME!)
		params.append('password', process.env.SF_PASSWORD!)

		console.log('SF Auth Request Debug:', {
			tokenUrl: this.tokenUrl,
			clientIdSet: !!this.clientId,
			clientSecretSet: !!this.clientSecret,
			usernameSet: !!process.env.SF_USERNAME,
			passwordSet: !!process.env.SF_PASSWORD,
			grantType: 'password',
			usernamePreview: process.env.SF_USERNAME?.slice(0, 10) + '...',
			passwordLength: process.env.SF_PASSWORD?.length || 0,
		})

		try {
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

			console.log('Salesforce authenticated:', {
				instanceUrl: this.instanceUrl,
				tokenPreview: this.accessToken?.slice(0, 20) + '...',
			})
		} catch (error: any) {
			const err = error as AxiosError

			console.error('Salesforce auth failed:', {
				status: err.response?.status,
				statusText: err.response?.statusText,
				data: err.response?.data,
				headers: err.response?.headers,
				message: err.message,
				code: err.code,
			})

			console.error('Request details:', {
				tokenUrl: this.tokenUrl,
				clientId: this.clientId?.slice(0, 20) + '...',
				hasUsername: !!process.env.SF_USERNAME,
				hasPassword: !!process.env.SF_PASSWORD,
				passwordLength: process.env.SF_PASSWORD?.length,
			})

			throw new Error(`Salesforce auth error: ${err.message}`)
		}
	}

	private async request<T>(
		method: 'post' | 'get' | 'patch',
		endpoint: string,
		data?: any,
	): Promise<T> {
		await this.authenticate()

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

			console.error('❌ Salesforce API error:', {
				endpoint,
				status: err.response?.status,
				errors: sfErrors,
			})

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
	async healthCheck(): Promise<{ ok: boolean; version?: string }> {
		try {
			await this.authenticate()
			const data = await this.request<{ latestVersion: string }>(
				'get',
				'/services/data',
			)
			return { ok: true, version: data.latestVersion }
		} catch {
			return { ok: false }
		}
	}
}

export const salesForceService = new SalesforceService()
