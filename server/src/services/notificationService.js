import Notification from '../models/Notification.js'
export const notificationService = { create: (data) => Notification.create(data), listForUser: (userId) => Notification.find({ recipient: userId, status: { $ne: 'archived' } }).sort({ createdAt: -1 }).limit(50), markRead: (id, userId) => Notification.findOneAndUpdate({ _id: id, recipient: userId }, { status: 'read' }, { new: true }) }
