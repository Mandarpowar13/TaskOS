import bcrypt from 'bcrypt'
import AppError from '../utils/AppError.js'
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { activityService } from './activityService.js'
import { userRepository } from '../repositories/userRepository.js'

async function issueSession(user) { const accessToken = createAccessToken(user.id); const refreshToken = createRefreshToken(user.id); user.refreshTokenHash = await bcrypt.hash(refreshToken, 12); user.lastLogin = new Date(); await user.save(); return { user: user.toJSON(), accessToken, refreshToken } }
export const authService = {
  async register(payload) { const existing = await userRepository.findByEmail(payload.email); if (existing) throw new AppError('An account with this email already exists.', 409); const user = await userRepository.create(payload); await activityService.record({ actor: user.id, entityType: 'user', entityId: user.id, action: 'user_registered', message: 'Account created.' }); return issueSession(user) },
  async login(payload) { const user = await userRepository.findByEmail(payload.email, true); if (!user || !(await user.comparePassword(payload.password))) throw new AppError('Invalid email or password.', 401); if (user.status !== 'active') throw new AppError('Your account is not active.', 403); const session = await issueSession(user); await activityService.record({ actor: user.id, entityType: 'user', entityId: user.id, action: 'user_logged_in', message: 'User logged in.' }); return session },
  async refresh(refreshToken) { let payload; try { payload = verifyRefreshToken(refreshToken) } catch { throw new AppError('Refresh token is invalid or expired.', 401) } if (payload.type !== 'refresh') throw new AppError('Invalid refresh token.', 401); const user = await userRepository.findById(payload.sub).select('+refreshTokenHash'); if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) throw new AppError('Refresh token is invalid.', 401); return issueSession(user) },
  async logout(user) { user.refreshTokenHash = undefined; await user.save(); await activityService.record({ actor: user.id, entityType: 'user', entityId: user.id, action: 'user_logged_out', message: 'User logged out.' }) },
  async changePassword(user, currentPassword, newPassword) { const account = await userRepository.findById(user.id).select('+password'); if (!(await account.comparePassword(currentPassword))) throw new AppError('Current password is incorrect.', 400); account.password = newPassword; await account.save(); await activityService.record({ actor: user.id, entityType: 'user', entityId: user.id, action: 'password_changed', message: 'Password changed.' }) },
}
