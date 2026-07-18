import { z } from 'zod'
import { TASK_STATUSES } from '../constants/task.js'

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.')
export const createBoardListSchema = z.object({ body: z.object({ name: z.string().trim().min(1).max(60), status: z.enum(TASK_STATUSES).default('todo') }), query: z.object({}), params: z.object({}) })
export const renameBoardListSchema = z.object({ body: z.object({ name: z.string().trim().min(1).max(60) }), query: z.object({}), params: z.object({ listId: objectId }) })
export const moveBoardCardSchema = z.object({ body: z.object({ listId: objectId }), query: z.object({}), params: z.object({ taskId: objectId }) })
