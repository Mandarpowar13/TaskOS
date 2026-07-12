import Activity from '../models/Activity.js'
export const activityService = { record: (data) => Activity.create(data), recentForUser: (userId, limit = 10) => Activity.find({ actor: userId }).sort({ createdAt: -1 }).limit(limit).populate('actor', 'name avatar') }
