import AppError from '../utils/AppError.js'
import BoardList from '../models/BoardList.js'
import { taskRepository } from '../repositories/taskRepository.js'
import { activityService } from './activityService.js'

const defaultLists = [
  ['Backlog', 'backlog'], ['To do', 'todo'], ['In progress', 'in-progress'],
  ['Waiting', 'waiting'], ['Review', 'review'], ['Completed', 'completed'],
]

async function ensureDefaultLists(user) {
  const existing = await BoardList.find({ owner: user.id }).sort({ position: 1 })
  if (existing.length) return existing
  return BoardList.insertMany(defaultLists.map(([name, status], position) => ({ name, status, position, owner: user.id })))
}

export const boardService = {
  async list(user) { return ensureDefaultLists(user) },
  async createList(user, payload) {
    const lists = await ensureDefaultLists(user)
    return BoardList.create({ ...payload, owner: user.id, position: lists.length })
  },
  async moveCard(user, taskId, listId) {
    const [task, list] = await Promise.all([
      taskRepository.findAccessibleById(taskId, user.id),
      BoardList.findOne({ _id: listId, owner: user.id }),
    ])
    if (!task) throw new AppError('Task not found.', 404)
    if (!list) throw new AppError('Board list not found.', 404)
    const previousStatus = task.status
    task.boardList = list._id
    task.status = list.status
    if (list.status === 'completed' && previousStatus !== 'completed') task.completionDate = new Date()
    if (list.status !== 'completed' && previousStatus === 'completed') task.completionDate = null
    await taskRepository.update(task)
    await activityService.record({ actor: user.id, entityType: 'task', entityId: task.id, action: 'task_updated', changes: { boardList: list.name, status: list.status }, message: `Moved task: ${task.title} to ${list.name}` })
    return task
  },
}
