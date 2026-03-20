export interface ISalesforceAuthResponse {
	access_token: string
	instance_url: string
	token_type: string
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
