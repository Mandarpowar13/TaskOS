import Task from '../models/Task.js'

const userScope = (userId) => ({ $or: [{ createdBy: userId }, { assignedUser: userId }], archived: false })

export const analyticsService = {
  async overview(user) {
    const now = new Date(); const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const startMonth = new Date(now.getFullYear(), now.getMonth(), 1); const scope = userScope(user.id)
    const [summary] = await Task.aggregate([{ $match: scope }, { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }, pending: { $sum: { $cond: [{ $in: ['$status', ['backlog', 'todo', 'in-progress', 'waiting', 'review']] }, 1, 0] } }, overdue: { $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', startToday] }, { $in: ['$status', ['backlog', 'todo', 'in-progress', 'waiting', 'review']] }] }, 1, 0] } } } }])
    const [byPriority, monthlyTrend, recentCompleted] = await Promise.all([
      Task.aggregate([{ $match: scope }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: { ...scope, createdAt: { $gte: startMonth } } }, { $group: { _id: { $dateToString: { format: '%d', date: '$createdAt' } }, created: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }, { $sort: { _id: 1 } }]),
      Task.find({ ...scope, completionDate: { $ne: null } }).sort({ completionDate: -1 }).limit(5).select('title completionDate priority'),
    ])
    const totals = summary || { total: 0, completed: 0, pending: 0, overdue: 0 }
    return { metrics: { ...totals, completionRate: totals.total ? Math.round((totals.completed / totals.total) * 100) : 0 }, byPriority, monthlyTrend, recentCompleted }
  },
}
