import { Router } from 'express'
import { changePassword, login, logout, refresh, register } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { changePasswordSchema, loginSchema, refreshSchema, registerSchema } from '../validators/authValidator.js'
const router = Router()
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', validate(refreshSchema), refresh)
router.post('/logout', protect, logout)
router.post('/change-password', protect, validate(changePasswordSchema), changePassword)
export default router
