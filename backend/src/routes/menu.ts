import express from 'express'
import * as MenuController from '../controllers/menu'
import { checkAuth } from '../middleware/auth'

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

export default router
