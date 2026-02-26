import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import type { IAuthDto } from '@/dto/auth.dto.js'
import { prisma } from '@/utils/prisma.js'
import { createAccessToken, createRefreshToken } from '@/utils/jwt.js'

export class AuthService {
	static async register(data: IAuthDto) {
		const existing = await prisma.user.findFirst({
			where: {
				OR: [{ email: data.email }, { username: data.username }],
			},
		})

		if (existing) throw new Error('User already exists')

		const hashed = await bcrypt.hash(data.password, 10)

		const user = await prisma.user.create({
			data: {
				...data,
				password: hashed,
				role: 'USER',
				isBlocked: false,
			},
		})

		const accessToken = createAccessToken({ id: user.id, role: user.role })
		const refreshToken = createRefreshToken({ id: user.id })

		const { password, ...userWithoutPassword } = user

		return {
			user: userWithoutPassword,
			accessToken,
			refreshToken,
		}
	}

	static async login(data: Omit<IAuthDto, 'username'>) {
		const user = await prisma.user.findUnique({ where: { email: data.email } })
		if (!user) throw new Error('Invalid credentials')

		const valid = await bcrypt.compare(data.password, user.password)
		if (!valid) throw new Error('Invalid credentials')

		const accessToken = createAccessToken({ id: user.id, role: user.role })
		const refreshToken = createRefreshToken({ id: user.id })

		const { password, ...userWithoutPassword } = user

		return { user: userWithoutPassword, accessToken, refreshToken }
	}

	static async refreshToken(token: string) {
		const payload: any = jwt.verify(token, process.env.REFRESH_TOKEN!)
		if (!payload) throw new Error('Invalid refresh token')

		const user = await prisma.user.findUnique({
			where: {
				id: payload.id,
			},
		})
		if (!user) throw new Error('User not found')

		const accessToken = createAccessToken({ id: user.id, role: user.role })

		return { accessToken }
	}
}
