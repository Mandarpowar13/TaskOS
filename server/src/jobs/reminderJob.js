import cron from 'node-cron'
import Task from '../models/Task.js'
import Notification from '../models/Notification.js'
import { ACTIVE_TASK_STATUSES } from '../constants/task.js'

export function startReminderJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date()
    const tasks = await Task.find({ reminderDate: { $lte: now, $gte: new Date(now.getTime() - 60_000) }, status: { $in: ACTIVE_TASK_STATUSES }, archived: false, assignedUser: { $ne: null } })
    await Promise.all(tasks.map((task) => Notification.updateOne({ recipient: task.assignedUser, type: 'reminder', entityId: task.id, createdAt: { $gte: new Date(now.getTime() - 60_000) } }, { $setOnInsert: { recipient: task.assignedUser, type: 'reminder', title: 'Task reminder', message: `Reminder: ${task.title}`, entityType: 'task', entityId: task.id } }, { upsert: true })))
  })
  console.info('Reminder job scheduled.')
}
