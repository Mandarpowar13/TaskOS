import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { analyticsService } from '../services/analyticsService.js'
export const getAnalytics = asyncHandler(async (req, res) => sendSuccess(res, { data: await analyticsService.overview(req.user) }))
