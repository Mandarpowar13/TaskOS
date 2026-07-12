import Category from '../models/Category.js'
import Project from '../models/Project.js'
import Task from '../models/Task.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
export const globalSearch = asyncHandler(async (req, res) => { const query = String(req.query.q || '').trim(); if (!query) return sendSuccess(res, { data: { tasks: [], projects: [], categories: [] } }); const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); const scope = { $or: [{ createdBy: req.user.id }, { assignedUser: req.user.id }], archived: false }; const [tasks, projects, categories] = await Promise.all([Task.find({ ...scope, $and: [{ $or: [{ title: regex }, { description: regex }] }] }).limit(8).select('title status priority dueDate'), Project.find({ $or: [{ owner: req.user.id }, { members: req.user.id }], name: regex }).limit(5).select('name color status'), Category.find({ $or: [{ owner: req.user.id }, { isDefault: true }], name: regex }).limit(5).select('name color')]); return sendSuccess(res, { data: { tasks, projects, categories } }) })
