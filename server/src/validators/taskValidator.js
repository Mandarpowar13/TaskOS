import { z } from 'zod'
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task.js'
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.')
const nullableObjectId = z.union([objectId, z.literal('').transform(() => null), z.null()]).optional()
const taskBody = z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().max(5000).optional(), project: nullableObjectId, category: nullableObjectId, priority: z.enum(TASK_PRIORITIES).optional(), status: z.enum(TASK_STATUSES).optional(), assignedUser: nullableObjectId, dueDate: z.coerce.date().nullable().optional(), reminderDate: z.coerce.date().nullable().optional(), estimatedTime: z.coerce.number().min(0).nullable().optional(), actualTime: z.coerce.number().min(0).nullable().optional(), tags: z.array(z.string().trim().min(1).max(40)).max(20).optional() })
const query = z.object({ status: z.enum(TASK_STATUSES).optional(), priority: z.enum(TASK_PRIORITIES).optional(), search: z.string().trim().max(100).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), archived: z.coerce.boolean().optional() })
const params = z.object({ taskId: objectId })
export const createTaskSchema = z.object({ body: taskBody, query: z.object({}), params: z.object({}) })
export const updateTaskSchema = z.object({ body: taskBody.partial(), query: z.object({}), params })
export const taskIdSchema = z.object({ body: z.object({}), query: z.object({}), params })
export const getTasksSchema = z.object({ body: z.object({}), query, params: z.object({}) })
