import 'dotenv/config'
import mongoose from 'mongoose'
import Task from './src/models/Task.js'
import User from './src/models/User.js'

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ Connected to MongoDB\n')

    // Get all users
    const users = await User.find({}).select('name email')
    console.log(`✓ Users in database: ${users.length}`)
    users.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} (${u.email}) - ID: ${u._id}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('Task ownership breakdown:')
    console.log('='.repeat(60))

    const allTasks = await Task.find({}).select('title status completionDate createdBy assignedUser')
    
    allTasks.forEach(task => {
      console.log(`\n"${task.title}"`)
      console.log(`  - status: ${task.status}`)
      console.log(`  - completionDate: ${task.completionDate || 'NULL'}`)
      console.log(`  - createdBy: ${task.createdBy}`)
      console.log(`  - assignedUser: ${task.assignedUser}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('Query by user scope:')
    console.log('='.repeat(60))

    if (users.length > 0) {
      const userId = users[0]._id
      console.log(`\nTesting with user: ${users[0].name} (${userId})`)
      
      const scope = { $or: [{ createdBy: userId }, { assignedUser: userId }], archived: false }
      const userTasks = await Task.find(scope).select('title status completionDate')
      console.log(`  Tasks accessible: ${userTasks.length}`)
      userTasks.forEach(t => {
        console.log(`    - "${t.title}": ${t.status}, completionDate: ${t.completionDate || 'NULL'}`)
      })

      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 6)
      const now = new Date()
      
      console.log(`\n  Testing weekly trend query (${weekStart.toISOString()} to ${now.toISOString()}):`)
      const weeklyData = await Task.aggregate([
        { $match: { ...scope, completionDate: { $exists: true, $ne: null, $gte: weekStart, $lte: now } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$completionDate' } },
            completed: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      console.log('  Weekly data:', JSON.stringify(weeklyData, null, 2))
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('✗ Error:', err.message)
    process.exit(1)
  }
}

test()
