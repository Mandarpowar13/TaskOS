import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { categoryService } from '../services/categoryService.js'
export const getCategories = asyncHandler(async (req, res) => sendSuccess(res, { data: await categoryService.list(req.user) }))
export const createCategory = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Category created.', data: await categoryService.create(req.user, req.validated.body) }))
export const updateCategory = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Category updated.', data: await categoryService.update(req.user, req.validated.params.categoryId, req.validated.body) }))
export const deleteCategory = asyncHandler(async (req, res) => { await categoryService.remove(req.user, req.validated.params.categoryId); return sendSuccess(res, { message: 'Category deleted.' }) })
