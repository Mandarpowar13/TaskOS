import { z } from 'zod'
const password = z.string().min(8, 'Password must be at least 8 characters.').max(128)
export const registerSchema = z.object({ body: z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(160), password }), query: z.object({}), params: z.object({}) })
export const loginSchema = z.object({ body: z.object({ email: z.string().trim().email(), password: z.string().min(1) }), query: z.object({}), params: z.object({}) })
export const refreshSchema = z.object({ body: z.object({ refreshToken: z.string().min(1) }), query: z.object({}), params: z.object({}) })
export const changePasswordSchema = z.object({ body: z.object({ currentPassword: z.string().min(1), newPassword: password }), query: z.object({}), params: z.object({}) })
