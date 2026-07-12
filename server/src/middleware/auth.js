import { userRepository } from '../repositories/userRepository.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../utils/jwt.js'

export const protect = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ')
  if (scheme !== 'Bearer' || !token) throw new AppError('Authentication is required.', 401)
  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    throw new AppError('Your session has expired. Please sign in again.', 401)
  }
  if (payload.type !== 'access') throw new AppError('Invalid access token.', 401)
  const user = await userRepository.findById(payload.sub)
  if (!user || user.status !== 'active') throw new AppError('Your account is unavailable.', 401)
  req.user = user
  next()
})

export function authorize(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission to perform this action.', 403)) }
