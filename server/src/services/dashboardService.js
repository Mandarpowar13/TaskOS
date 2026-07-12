import Task from '../models/Task.js'
import { activityService } from './activityService.js'

export const dashboardService = {
  async getDashboard(user) {
    const now = new Date(); const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); const weekStart = new Date(startToday); weekStart.setDate(weekStart.getDate() - 6); const scope = { $or: [{ createdBy: user.id }, { assignedUser: user.id }], archived: false }
    const [todayTasks, completedToday, pending, overdue, weeklyProgress, recentActivity, upcomingReminders] = await Promise.all([
      Task.find({ ...scope, dueDate: { $gte: startToday, $lt: endToday }, status: { $nin: ['completed', 'cancelled'] } }).sort({ priority: -1, dueDate: 1 }).limit(10),
      Task.countDocuments({ ...scope, completionDate: { $gte: startToday, $lt: endToday } }),
      Task.countDocuments({ ...scope, status: { $nin: ['completed', 'cancelled'] } }),
      Task.countDocuments({ ...scope, dueDate: { $lt: startToday }, status: { $nin: ['completed', 'cancelled'] } }),
      Task.aggregate([{ $match: { ...scope, createdAt: { $gte: weekStart } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, created: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }]),
      activityService.recentForUser(user.id),
      Task.find({ ...scope, reminderDate: { $gte: now }, status: { $nin: ['completed', 'cancelled'] } }).sort({ reminderDate: 1 }).limit(5),
    ])
    return { todayTasks, metrics: { completedToday, pending, overdue }, weeklyProgress, recentActivity, upcomingReminders }
  },
}
