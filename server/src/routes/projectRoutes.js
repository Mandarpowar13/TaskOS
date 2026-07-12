import { Router } from 'express'
import { archiveProject, createProject, getProject, getProjects, updateProject } from '../controllers/projectController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createProjectSchema, projectIdSchema, updateProjectSchema } from '../validators/projectValidator.js'
const router = Router()
router.use(protect)
router.route('/').get(getProjects).post(validate(createProjectSchema), createProject)
router.route('/:projectId').get(validate(projectIdSchema), getProject).patch(validate(updateProjectSchema), updateProject).delete(validate(projectIdSchema), archiveProject)
export default router
