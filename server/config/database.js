import mongoose from 'mongoose'

export async function connectDatabase(uri) {
  mongoose.set('strictQuery', true)

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })

  console.info(`MongoDB connected: ${mongoose.connection.host}`)
}
