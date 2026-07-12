import { z } from 'zod'

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.')
const body = z.object({ name: z.string().trim().min(1).max(120), description: z.string().trim().max(5000).optional(), color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Use a hex color such as #2563eb.').optional(), status: z.enum(['active', 'on-hold', 'completed', 'archived']).optional(), members: z.array(objectId).max(100).optional() })
const params = z.object({ projectId: objectId })
export const createProjectSchema = z.object({ body, query: z.object({}), params: z.object({}) })
export const updateProjectSchema = z.object({ body: body.partial(), query: z.object({}), params })
export const projectIdSchema = z.object({ body: z.object({}), query: z.object({}), params })
