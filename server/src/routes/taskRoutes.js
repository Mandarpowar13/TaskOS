import { Router } from 'express'
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createTaskSchema, getTasksSchema, taskIdSchema, updateTaskSchema } from '../validators/taskValidator.js'
const router = Router()
router.use(protect)
router.route('/').get(validate(getTasksSchema), getTasks).post(validate(createTaskSchema), createTask)
router.route('/:taskId').get(validate(taskIdSchema), getTask).patch(validate(updateTaskSchema), updateTask).delete(validate(taskIdSchema), deleteTask)
export default router
