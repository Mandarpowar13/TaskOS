import Task from '../models/Task.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'

const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'category', 'project']

function pickTaskFields(source) {
  return Object.fromEntries(Object.entries(source).filter(([key]) => allowedFields.includes(key)))
}

function setCompletionDate(task, previousStatus) {
  if (task.status === 'completed' && previousStatus !== 'completed') task.completedAt = new Date()
  if (task.status !== 'completed') task.completedAt = null
}

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, project, search, page = '1', limit = '20' } = req.query
  const filter = {}

  if (status) filter.status = status
  if (priority) filter.priority = priority
  if (project) filter.project = project
  if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]

  const safePage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100)
  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ dueDate: 1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Task.countDocuments(filter),
  ])

  res.status(200).json({ success: true, data: tasks, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } })
})

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
  if (!task) throw new AppError('Task not found.', 404)
  res.status(200).json({ success: true, data: task })
})

export const createTask = asyncHandler(async (req, res) => {
  const task = new Task(pickTaskFields(req.body))
  setCompletionDate(task)
  await task.save()
  res.status(201).json({ success: true, data: task })
})

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
  if (!task) throw new AppError('Task not found.', 404)
  const previousStatus = task.status
  Object.assign(task, pickTaskFields(req.body))
  setCompletionDate(task, previousStatus)
  await task.save()
  res.status(200).json({ success: true, data: task })
})

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.taskId)
  if (!task) throw new AppError('Task not found.', 404)
  res.status(204).send()
})
