import express from 'express'
import * as MenuController from '../controllers/menu'
import { checkAuth } from '../middleware/auth'
import categoryRoutes from './category'

const router = express.Router()

//  Create a new menu
router.post('/', checkAuth, MenuController.createMenu)

// Get Menus by User
router.get('/', checkAuth, MenuController.getMenus)

// Get Menu by ID
router.get('/:menuId', checkAuth, MenuController.getMenuById)

// Update a Menu by ID
router.patch<{ menuId: string }>(
	'/:menuId',
	checkAuth,
	MenuController.updateMenu
)

// Delete a Menu by ID
router.delete('/:menuId', checkAuth, MenuController.deleteMenu)

// Nest the category routes under the menu routes
router.use('/:menuId/categories', checkAuth, categoryRoutes)

export default router
