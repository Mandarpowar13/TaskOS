import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { notificationService } from '../services/notificationService.js'
export const getNotifications = asyncHandler(async (req, res) => sendSuccess(res, { data: await notificationService.listForUser(req.user.id) }))
export const readNotification = asyncHandler(async (req, res) => { const notification = await notificationService.markRead(req.params.notificationId, req.user.id); if (!notification) throw new AppError('Notification not found.', 404); return sendSuccess(res, { data: notification }) })
