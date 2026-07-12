import { Router } from 'express'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js'
const router = Router()
router.use(protect)
router.route('/').get(getCategories).post(validate(createCategorySchema), createCategory)
router.route('/:categoryId').patch(validate(updateCategorySchema), updateCategory).delete(validate(categoryIdSchema), deleteCategory)
export default router
