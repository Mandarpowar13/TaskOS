import AppError from '../utils/AppError.js'
import { taskRepository } from '../repositories/taskRepository.js'
import { activityService } from './activityService.js'

function accessFilter(userId) { return { $or: [{ createdBy: userId }, { assignedUser: userId }] } }
function recordChanges(previous, next) { return Object.fromEntries(Object.keys(next).filter((key) => JSON.stringify(previous[key]) !== JSON.stringify(next[key])).map((key) => [key, { from: previous[key], to: next[key] }])) }
function normalizeCompletion(task, previousStatus) { if (task.status === 'completed' && previousStatus !== 'completed') task.completionDate = new Date(); if (task.status !== 'completed') task.completionDate = null }

export const taskService = {
  async list(user, filters) { const filter = { ...accessFilter(user.id), archived: filters.archived ?? false }; if (filters.status) filter.status = filters.status; if (filters.priority) filter.priority = filters.priority; if (filters.search) filter.$text = { $search: filters.search }; const [data, total] = await Promise.all([taskRepository.find(filter, { sort: filters.search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { dueDate: 1, createdAt: -1 }, skip: (filters.page - 1) * filters.limit, limit: filters.limit }), taskRepository.count(filter)]); return { data, meta: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) } } },
  async get(user, taskId) { const task = await taskRepository.findAccessibleById(taskId, user.id); if (!task) throw new AppError('Task not found.', 404); return task },
  async create(user, payload) { const task = await taskRepository.create({ ...payload, createdBy: user.id, assignedUser: payload.assignedUser || user.id }); normalizeCompletion(task); await task.save(); await activityService.record({ actor: user.id, entityType: 'task', entityId: task.id, action: 'task_created', message: `Created task: ${task.title}` }); return task },
  async update(user, taskId, payload) { const task = await this.get(user, taskId); const previous = task.toObject(); const previousStatus = task.status; Object.assign(task, payload); normalizeCompletion(task, previousStatus); const changes = recordChanges(previous, task.toObject()); await taskRepository.update(task); if (Object.keys(changes).length) await activityService.record({ actor: user.id, entityType: 'task', entityId: task.id, action: task.status === 'completed' && previousStatus !== 'completed' ? 'task_completed' : 'task_updated', changes, message: `Updated task: ${task.title}` }); return task },
  async remove(user, taskId) { const task = await this.get(user, taskId); await activityService.record({ actor: user.id, entityType: 'task', entityId: task.id, action: 'task_deleted', changes: { title: task.title }, message: `Deleted task: ${task.title}` }); await taskRepository.delete(task) },
}
