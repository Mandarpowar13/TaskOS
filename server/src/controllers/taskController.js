import { taskService } from '../services/taskService.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
export const getTasks = asyncHandler(async (req, res) => { const result = await taskService.list(req.user, req.validated.query); return sendSuccess(res, result) })
export const getTask = asyncHandler(async (req, res) => sendSuccess(res, { data: await taskService.get(req.user, req.validated.params.taskId) }))
export const createTask = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Task created.', data: await taskService.create(req.user, req.validated.body) }))
export const updateTask = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Task updated.', data: await taskService.update(req.user, req.validated.params.taskId, req.validated.body) }))
export const deleteTask = asyncHandler(async (req, res) => { await taskService.remove(req.user, req.validated.params.taskId); return sendSuccess(res, { message: 'Task deleted.' }) })
