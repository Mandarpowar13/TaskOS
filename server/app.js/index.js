import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import errorHandler from '../middleware/errorHandler.js'
import notFound from '../middleware/notFound.js'
import healthRoutes from '../routes/healthRoutes.js'
import taskRoutes from '../routes/taskRoutes.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim())

app.use(helmet())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/api', (req, res) => res.status(200).json({ success: true, message: 'TMA API is running.' }))
app.use('/api/health', healthRoutes)
app.use('/api/tasks', taskRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
