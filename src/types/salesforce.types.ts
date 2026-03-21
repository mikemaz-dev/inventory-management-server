export interface ISalesforceAuthResponse {
	access_token: string
	refresh_token?: string
	instance_url: string
	token_type: string
	issued_at?: string
	signature?: string
}

export interface ISalesforceError {
	message: string
	errorCode: string
	fields?: string[]
}

export interface IAccountData {
	Name: string
	Phone?: string
	Website?: string
}

export interface IContactData {
	FirstName: string
	LastName: string
	Email?: string
	AccountId: string
}
