import { authService } from '../services/authService.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
export const register = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Account created successfully.', data: await authService.register(req.validated.body) }))
export const login = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Logged in successfully.', data: await authService.login(req.validated.body) }))
export const refresh = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Session refreshed.', data: await authService.refresh(req.validated.body.refreshToken) }))
export const logout = asyncHandler(async (req, res) => { await authService.logout(req.user); return sendSuccess(res, { message: 'Logged out successfully.' }) })
export const changePassword = asyncHandler(async (req, res) => { const { currentPassword, newPassword } = req.validated.body; await authService.changePassword(req.user, currentPassword, newPassword); return sendSuccess(res, { message: 'Password changed successfully.' }) })
