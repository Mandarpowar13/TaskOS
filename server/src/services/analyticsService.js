import Task from '../models/Task.js'

const userScope = (user) => ({
  $or: [{ createdBy: user._id }, { assignedUser: user._id }],
  archived: false,
})

export const analyticsService = {
  async overview(user) {
    try {
      const now = new Date()
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const weekStart = new Date(startToday)
      weekStart.setDate(weekStart.getDate() - 6)
      const scope = userScope(user)

      const [summary] = await Task.aggregate([
        { $match: scope },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $in: ['$status', ['backlog', 'todo', 'in-progress', 'waiting', 'review']] }, 1, 0] } },
            overdue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lt: ['$dueDate', startToday] },
                      { $in: ['$status', ['backlog', 'todo', 'in-progress', 'waiting', 'review']] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ])

      const [byPriority, monthlyTrend, weeklyTrend, recentCompleted] = await Promise.all([
        Task.aggregate([
          { $match: scope },
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),
        Task.aggregate([
          { $match: { ...scope, completionDate: { $exists: true, $ne: null, $gte: startMonth, $lte: now } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$completionDate' } },
              completed: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Task.aggregate([
          { $match: { ...scope, completionDate: { $exists: true, $ne: null, $gte: weekStart, $lte: now } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$completionDate' } },
              completed: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Task.find({ ...scope, completionDate: { $exists: true, $ne: null } })
          .sort({ completionDate: -1 })
          .limit(5)
          .select('title completionDate priority'),
      ])

      const totals = summary || { total: 0, completed: 0, pending: 0, overdue: 0 }
      return {
        metrics: {
          ...totals,
          completionRate: totals.total ? Math.round((totals.completed / totals.total) * 100) : 0,
        },
        byPriority: byPriority || [],
        monthlyTrend: monthlyTrend || [],
        weeklyTrend: weeklyTrend || [],
        recentCompleted: recentCompleted || [],
      }
    } catch (error) {
      console.error('Analytics overview error:', error)
      throw error
    }
  },
}
