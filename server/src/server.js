import 'dotenv/config'
import http from 'http'
import app from './app.js'
import { connectDatabase } from './config/database.js'
import { startReminderJob } from './jobs/reminderJob.js'
import { createSocketServer } from './socket/index.js'
const port = Number(process.env.PORT) || 5000
if (!process.env.MONGODB_URI || !process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) { console.error('MONGODB_URI, JWT_ACCESS_SECRET, and JWT_REFRESH_SECRET must be set in .env.'); process.exit(1) }
async function start() { try { await connectDatabase(process.env.MONGODB_URI); const httpServer = http.createServer(app); createSocketServer(httpServer); startReminderJob(); httpServer.listen(port, '0.0.0.0', () => console.info(`TMA API listening on port ${port}`)); for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => httpServer.close(() => process.exit(0))) } catch (error) { console.error('Unable to start TMA API:', error.message); process.exit(1) } }
start()
