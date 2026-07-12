import { dashboardService } from '../services/dashboardService.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
export const getDashboard = asyncHandler(async (req, res) => sendSuccess(res, { data: await dashboardService.getDashboard(req.user) }))
