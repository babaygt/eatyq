import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { assertIsDefined } from '../util/assertIsDefined'
import mongoose from 'mongoose'
import ItemModel from '../models/item'
import CategoryModel from '../models/category'

// Create a new item

interface CreateItemParams {
	categoryId: string
}

interface CreateItemBody {
	name?: string
	description?: string
	price?: number
	imageUrl?: string
	variations?: {
		name: string
		price?: number
	}[]
}

export const createItem: RequestHandler<
	CreateItemParams,
	unknown,
	CreateItemBody,
	unknown
> = async (req, res, next) => {
	const { name, description, price, imageUrl, variations } = req.body
	const categoryId = req.params.categoryId

	try {
		assertIsDefined(categoryId)

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			throw createHttpError(400, 'Invalid category ID')
		}

		if (!name || typeof price !== 'number') {
			throw createHttpError(400, 'Item name and price are required')
		}

		const item = await ItemModel.create({
			category: categoryId,
			name,
			description,
			price,
			imageUrl,
			variations,
		})

		// Add the new item to the category's item list
		await CategoryModel.findByIdAndUpdate(categoryId, {
			$push: { items: item._id },
		})

		res.status(201).json(item)
	} catch (error) {
		next(error)
	}
}

// Get all items for a specific category

interface GetItemsParams {
	categoryId: string
}

export const getItems: RequestHandler<
	GetItemsParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const categoryId = req.params.categoryId

	try {
		assertIsDefined(categoryId)

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			throw createHttpError(400, 'Invalid category ID')
		}

		const items = await ItemModel.find({ category: categoryId })

		res.status(200).json(items)
	} catch (error) {
		next(error)
	}
}

// Update an existing item

interface UpdateItemParams {
	itemId: string
}

interface UpdateItemBody {
	name?: string
	description?: string
	price?: number
	imageUrl?: string
	variations?: {
		name: string
		price?: number
	}[]
}

export const updateItem: RequestHandler<
	UpdateItemParams,
	unknown,
	UpdateItemBody,
	unknown
> = async (req, res, next) => {
	const { name, description, price, imageUrl, variations } = req.body
	const itemId = req.params.itemId

	try {
		assertIsDefined(itemId)

		if (!mongoose.Types.ObjectId.isValid(itemId)) {
			throw createHttpError(400, 'Invalid item ID')
		}

		const item = await ItemModel.findByIdAndUpdate(
			itemId,
			{ name, description, price, imageUrl, variations },
			{ new: true }
		)

		if (!item) {
			throw createHttpError(404, 'Item not found')
		}

		res.status(200).json(item)
	} catch (error) {
		next(error)
	}
}

// Delete an item

export const deleteItem: RequestHandler = async (req, res, next) => {
	const itemId = req.params.itemId

	try {
		assertIsDefined(itemId)

		if (!mongoose.Types.ObjectId.isValid(itemId)) {
			throw createHttpError(400, 'Invalid item ID')
		}

		const deletedItem = await ItemModel.findByIdAndDelete(itemId)

		if (!deletedItem) {
			return res
				.status(200)
				.json({ message: 'Item already deleted or not found' })
		}

		// Remove the item from the category's item list
		await CategoryModel.findByIdAndUpdate(deletedItem.category, {
			$pull: { items: deletedItem._id },
		})

		res.status(200).json({ message: 'Item deleted successfully' })
	} catch (error) {
		next(error)
	}
}
