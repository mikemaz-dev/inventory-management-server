import type { ROLE } from '@/generated/prisma/client.js'
import { prisma } from '@/utils/prisma.js'

export class UserService {
	static async getById(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				username: true,
				avatar: true,
				role: true,
				isBlocked: true,
				createdAt: true,
			},
		})

		if (!user) throw new Error('User not found')

		return user
	}

	static async getAll() {
		return prisma.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				avatar: true,
				role: true,
				isBlocked: true,
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
		})
	}

	static async updateProfile(
		id: string,
		data: { username?: string; avatar?: string },
	) {
		return prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				email: true,
				username: true,
				avatar: true,
				role: true,
				isBlocked: true,
			},
		})
	}

	static async blockUser(id: string, isBlocked: boolean) {
		return prisma.user.update({
			where: { id },
			data: { isBlocked },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
				isBlocked: true,
			},
		})
	}

	static async changeRole(id: string, role: ROLE) {
		return prisma.user.update({
			where: { id },
			data: { role },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		})
	}
}
