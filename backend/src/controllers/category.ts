import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { assertIsDefined } from '../util/assertIsDefined'
import mongoose from 'mongoose'
import CategoryModel from '../models/category'
import MenuModel from '../models/menu'

interface CreateCategoryParams {
	menuId: string
}

interface CreateCategoryBody {
	name?: string
}

export const createCategory: RequestHandler<
	CreateCategoryParams,
	unknown,
	CreateCategoryBody,
	unknown
> = async (req, res, next) => {
	const { name } = req.body
	const menuId = req.params.menuId

	try {
		assertIsDefined(menuId)

		if (!mongoose.Types.ObjectId.isValid(menuId)) {
			throw createHttpError(400, 'Invalid menu ID')
		}

		if (!name) {
			throw createHttpError(400, 'Category name is required')
		}

		const newCategory = await CategoryModel.create({
			menu: menuId,
			name,
		})

		// Add the new category to the menu's category list
		await MenuModel.findByIdAndUpdate(menuId, {
			$push: { categories: newCategory._id },
		})

		res.status(201).json(newCategory)
	} catch (error) {
		next(error)
	}
}

// Get all categories for a specific menu

interface GetCategoriesParams {
	menuId: string
}

export const getCategories: RequestHandler<
	GetCategoriesParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const menuId = req.params.menuId

	try {
		assertIsDefined(menuId)

		if (!mongoose.Types.ObjectId.isValid(menuId)) {
			throw createHttpError(400, 'Invalid menu ID')
		}

		const categories = await CategoryModel.find({ menu: menuId }).populate(
			'items'
		)

		res.status(200).json(categories)
	} catch (error) {
		next(error)
	}
}

// Update an existing category

interface UpdateCategoryParams {
	categoryId: string
}

interface UpdateCategoryBody {
	name?: string
}

export const updateCategory: RequestHandler<
	UpdateCategoryParams,
	unknown,
	UpdateCategoryBody,
	unknown
> = async (req, res, next) => {
	const { name } = req.body
	const categoryId = req.params.categoryId

	try {
		assertIsDefined(categoryId)

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			throw createHttpError(400, 'Invalid category ID')
		}

		const category = await CategoryModel.findByIdAndUpdate(
			categoryId,
			{ name },
			{ new: true }
		)

		if (!category) {
			throw createHttpError(404, 'Category not found')
		}

		res.status(200).json(category)
	} catch (error) {
		next(error)
	}
}

// Delete a category

export const deleteCategory: RequestHandler = async (req, res, next) => {
	const categoryId = req.params.categoryId

	try {
		assertIsDefined(categoryId)

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			throw createHttpError(400, 'Invalid category ID')
		}

		const category = await CategoryModel.findByIdAndDelete(categoryId)

		if (!category) {
			throw createHttpError(404, 'Category not found')
		}

		await MenuModel.findByIdAndUpdate(category.menu, {
			$pull: { categories: categoryId },
		})

		res.status(204).json({ message: 'Category deleted successfully' })
	} catch (error) {
		next(error)
	}
}
