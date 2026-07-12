import { Router } from 'express'
import { getNotifications, readNotification } from '../controllers/notificationController.js'
import { protect } from '../middleware/auth.js'
const router = Router()
router.use(protect)
router.get('/', getNotifications)
router.patch('/:notificationId/read', readNotification)
export default router
