export class HttpException extends Error {
	public readonly status: number
	public readonly details?: unknown

	constructor(status: number, message: string, details?: string) {
		super(message)

		this.status = status
		this.details = details

		Object.setPrototypeOf(this, new.target.prototype)
		Error.captureStackTrace(this)
	}
}
