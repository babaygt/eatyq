import express from 'express'
import * as ItemController from '../controllers/item'
import { checkAuth } from '../middleware/auth'

const router = express.Router({ mergeParams: true }) // mergeParams to access categoryId from parent router

// Route to get all items for a specific category
router.get<{ categoryId: string }>('/', checkAuth, ItemController.getItems)

// Route to create a new item in a specific category
router.post<{ categoryId: string }>('/', checkAuth, ItemController.createItem)

// Route to update an item by ID
router.put<{ itemId: string }>('/:itemId', checkAuth, ItemController.updateItem)

// Route to delete an item by ID
router.delete('/:itemId', checkAuth, ItemController.deleteItem)

export default router
