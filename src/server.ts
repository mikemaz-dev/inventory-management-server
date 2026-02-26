import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.route.js'
import { userRouter } from './routes/user.route.js'
import { prisma } from './utils/prisma.js'
import { inventoryRouter } from './routes/inventory.route.js'
import { itemRouter } from './routes/item.route.js'
import { inventoryFieldRouter } from './routes/inventory-field.route.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
	cors({
		origin: ['http://localhost:3000'],
		credentials: true,
	}),
)

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/inventories', inventoryRouter)
app.use('/api/items', itemRouter)
app.use('/api/inventory-fields', inventoryFieldRouter)

app.use((_, res) => {
	res.status(404).json({ message: 'Not found' })
})

app.use((err: any, req: Request, res: Response, next: any) => {
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
