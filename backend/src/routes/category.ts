import express from 'express'
import * as CategoryController from '../controllers/category'
import { checkAuth } from '../middleware/auth'
import itemRoutes from './item'

const router = express.Router({ mergeParams: true }) // mergeParams to access menuId from parent router

// Route to get all categories for a specific menu
router.get<{ menuId: string }>('/', checkAuth, CategoryController.getCategories)

// Route to create a new category in a specific menu
router.post<{ menuId: string }>(
	'/',
	checkAuth,
	CategoryController.createCategory
)

// Route to update a category by ID
router.put<{ categoryId: string }>(
	'/:categoryId',
	checkAuth,
	CategoryController.updateCategory
)

// Route to delete a category by ID
router.delete('/:categoryId', checkAuth, CategoryController.deleteCategory)

// Nest the item routes under the category routes
router.use('/:categoryId/items', checkAuth, itemRoutes)

export default router
