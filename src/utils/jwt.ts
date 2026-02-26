import jwt from 'jsonwebtoken'

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'access_secret'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'refresh_secret'

export const createAccessToken = (payload: object) => {
	return jwt.sign(payload, ACCESS_TOKEN, {
		expiresIn: '15m',
	})
}

export const createRefreshToken = (payload: object) => {
	return jwt.sign(payload, REFRESH_TOKEN, {
		expiresIn: '7d',
	})
}

export const verifyAccessToken = (token: string) => {
	try {
		return jwt.verify(token, ACCESS_TOKEN)
	} catch (error) {
		return null
	}
}

export const verifyRefreshToken = (token: string) => {
	try {
		return jwt.verify(token, REFRESH_TOKEN)
	} catch (error) {
		return null
	}
}
