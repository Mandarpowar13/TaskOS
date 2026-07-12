import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { projectService } from '../services/projectService.js'
export const getProjects = asyncHandler(async (req, res) => sendSuccess(res, { data: await projectService.list(req.user) }))
export const getProject = asyncHandler(async (req, res) => sendSuccess(res, { data: await projectService.get(req.user, req.validated.params.projectId) }))
export const createProject = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Project created.', data: await projectService.create(req.user, req.validated.body) }))
export const updateProject = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Project updated.', data: await projectService.update(req.user, req.validated.params.projectId, req.validated.body) }))
export const archiveProject = asyncHandler(async (req, res) => { await projectService.archive(req.user, req.validated.params.projectId); return sendSuccess(res, { message: 'Project archived.' }) })
