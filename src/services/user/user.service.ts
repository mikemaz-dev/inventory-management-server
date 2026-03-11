import { prisma } from '@/utils/prisma.js'
import type { ROLE } from '@prisma/client'

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

	static async deleteUser(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
			select: { id: true, role: true },
		})

		if (!user) throw new Error('User not found')

		if (user.role === 'ADMIN') {
			const adminsCount = await prisma.user.count({
				where: { role: 'ADMIN' },
			})

			if (adminsCount <= 1) {
				throw new Error('Cannot delete the last admin')
			}
		}

		await prisma.user.delete({
			where: { id },
		})

		return { deletedId: id }
	}
}
