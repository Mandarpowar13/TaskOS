import { ZodError } from 'zod'
import AppError from '../utils/AppError.js'

export function notFound(req, res, next) { next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404)) }

export function errorHandler(error, req, res, next) {
  let normalized = error
  if (error instanceof ZodError) normalized = new AppError('Request validation failed.', 400, error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })))
  if (error.name === 'CastError') normalized = new AppError('The requested resource identifier is invalid.', 400)
  if (error.code === 11000) normalized = new AppError('A record with this value already exists.', 409)
  const statusCode = normalized.statusCode || 500
  if (statusCode >= 500) console.error(normalized)
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(statusCode).json({
    success: false,
    message: normalized.isOperational ? normalized.message : 'An unexpected server error occurred.',
    errors: normalized.errors || [],
    ...(!isProduction && !normalized.isOperational ? { debug: normalized.message } : {}),
  })
}
