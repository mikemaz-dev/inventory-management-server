import { HttpException } from './http.exception.js'

export class ForbiddenException extends HttpException {
	constructor(message = 'Access denied') {
		super(403, message)
	}
}
