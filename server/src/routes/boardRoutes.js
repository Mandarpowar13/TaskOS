import { Router } from 'express'
import { createBoardList, getBoardLists, moveBoardCard, renameBoardList } from '../controllers/boardController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createBoardListSchema, moveBoardCardSchema, renameBoardListSchema } from '../validators/boardValidator.js'

const router = Router()
router.use(protect)
router.route('/lists').get(getBoardLists).post(validate(createBoardListSchema), createBoardList)
router.patch('/lists/:listId', validate(renameBoardListSchema), renameBoardList)
router.patch('/cards/:taskId/move', validate(moveBoardCardSchema), moveBoardCard)
export default router
