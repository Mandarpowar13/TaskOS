import { z } from 'zod'
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.')
const body = z.object({ name: z.string().trim().min(1).max(80), color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Use a hex color such as #2563eb.').optional() })
const params = z.object({ categoryId: objectId })
export const createCategorySchema = z.object({ body, query: z.object({}), params: z.object({}) })
export const updateCategorySchema = z.object({ body: body.partial(), query: z.object({}), params })
export const categoryIdSchema = z.object({ body: z.object({}), query: z.object({}), params })
