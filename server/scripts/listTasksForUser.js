import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import Task from '../src/models/Task.js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node listTasksForUser.js <email>')
  process.exit(1)
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  try {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      console.error('User not found')
      return
    }
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const tasks = await Task.find({ $or: [{ createdBy: user._id }, { assignedUser: user._id }], createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(200)
    console.log(`Found ${tasks.length} tasks for ${email} since ${since.toISOString()}`)
    for (const t of tasks) {
      console.log(`- ${t.title} | status=${t.status} | createdAt=${t.createdAt.toISOString()} | id=${t._id}`)
    }
  } finally {
    await mongoose.disconnect()
  }
}

run().catch((err) => { console.error(err); process.exit(1) })
