import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'

import express, { type Response } from 'express'

import {
	authRouter,
	integrationsRouter,
	inventoryCustomIdRouter,
	inventoryFieldRouter,
	inventoryRouter,
	itemRouter,
	tagRouter,
	userRouter,
} from './routes/index.js'

import { prisma } from './utils/prisma.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
	cors({
		origin: ['https://inventory-management-zeta-rust.vercel.app'],
		credentials: true,
	}),
)

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/inventories', inventoryRouter)
app.use('/api/items', itemRouter)
app.use('/api/inventory-fields', inventoryFieldRouter)
app.use('/api/tags', tagRouter)
app.use('/api/inventories/custom-id', inventoryCustomIdRouter)
app.use('/api/integrations', integrationsRouter)

app.use((_, res) => {
	res.status(404).json({ message: 'Not found' })
})

app.use((err: any, res: Response) => {
	console.error(err)

	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal server error',
	})
})

const PORT = process.env.PORT || 4200

const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

process.on('SIGTERM', async () => {
	console.log('SIGTERM received. Shutting down...')
	await prisma.$disconnect()
	server.close(() => {
		process.exit(0)
	})
})
