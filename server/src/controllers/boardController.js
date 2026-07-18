import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { boardService } from '../services/boardService.js'

export const getBoardLists = asyncHandler(async (req, res) => sendSuccess(res, { data: await boardService.list(req.user) }))
export const createBoardList = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Board list created.', data: await boardService.createList(req.user, req.validated.body) }))
export const renameBoardList = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Board list renamed.', data: await boardService.renameList(req.user, req.validated.params.listId, req.validated.body.name) }))
export const moveBoardCard = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Task moved.', data: await boardService.moveCard(req.user, req.validated.params.taskId, req.validated.body.listId) }))
