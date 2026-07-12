import 'dotenv/config'
import app from '../app.js/index.js'
import { connectDatabase } from '../config/database.js'

const port = Number(process.env.PORT) || 5000
const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  console.error('MONGODB_URI is required. Copy .env.example to .env and configure MongoDB.')
  process.exit(1)
}

async function startServer() {
  try {
    await connectDatabase(mongoUri)
    const server = app.listen(port, () => console.info(`TMA API listening on http://localhost:${port}`))
    const shutdown = (signal) => {
      console.info(`${signal} received. Closing TMA API.`)
      server.close(() => process.exit(0))
    }
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (error) {
    console.error('Unable to start TMA API:', error.message)
    process.exit(1)
  }
}

startServer()
