import 'dotenv/config'
import mongoose from 'mongoose'
import Task from './src/models/Task.js'

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    const tasks = await Task.find({}).select('title status completionDate createdAt').limit(15)
    console.log(`\n✓ Total tasks in database: ${tasks.length}\n`)

    console.log('Sample tasks:')
    tasks.forEach((t, i) => {
      console.log(`  ${i + 1}. "${t.title}"`)
      console.log(`     status: ${t.status}`)
      console.log(`     completionDate: ${t.completionDate || 'NULL'}`)
    })

    const completedCount = await Task.countDocuments({ completionDate: { $ne: null } })
    console.log(`\n✓ Tasks WITH completionDate: ${completedCount}`)

    const completedByStatus = await Task.countDocuments({ status: 'completed' })
    console.log(`✓ Tasks with status=completed: ${completedByStatus}`)

    const completedWithoutDate = await Task.find({
      status: 'completed',
      completionDate: null
    }).select('title')
    console.log(`✓ Tasks with status=completed but NO completionDate: ${completedWithoutDate.length}`)
    if (completedWithoutDate.length > 0) {
      console.log('   These need fixing:')
      completedWithoutDate.forEach(t => console.log(`   - ${t.title}`))
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('✗ Error:', err.message)
    process.exit(1)
  }
}

test()
