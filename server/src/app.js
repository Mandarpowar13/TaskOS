import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import boardRoutes from './routes/boardRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
const app = express()
const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim())
app.use(helmet())
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.get('/api', (req, res) => res.status(200).json({ success: true, message: 'TMA API is running.' }))
app.get('/api/health', (req, res) => res.status(200).json({ success: true, message: 'TMA API is healthy.' }))
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationRoutes)
app.use(notFound)
app.use(errorHandler)
export default app
