import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import MenuModel from '../models/menu'
import { assertIsDefined } from '../util/assertIsDefined'
import mongoose from 'mongoose'

//  Create a new menu

interface CreateMenuBody {
	name?: string
}

export const createMenu: RequestHandler<
	unknown,
	unknown,
	CreateMenuBody,
	unknown
> = async (req, res, next) => {
	const { name } = req.body
	const userId = req.session.userId

	try {
		assertIsDefined(userId)

		if (!name) {
			throw createHttpError(400, 'Name is required')
		}

		const menu = await MenuModel.create({
			user: userId,
			name,
		})

		res.status(201).json(menu)
	} catch (error) {
		next(error)
	}
}

// Get Menus by User

export const getMenus: RequestHandler = async (req, res, next) => {
	const userId = req.session.userId

	try {
		assertIsDefined(userId)

		const menus = await MenuModel.find({ user: userId }).exec()

		res.status(200).json(menus)
	} catch (error) {
		next(error)
	}
}

// Get Menu by ID

export const getMenuById: RequestHandler = async (req, res, next) => {
	const userId = req.session.userId
	const menuId = req.params.menuId

	try {
		assertIsDefined(userId)

		if (!mongoose.isValidObjectId(menuId)) {
			throw createHttpError(400, 'Invalid menu ID')
		}

		const menu = await MenuModel.findOne({ _id: menuId, user: userId }).exec()

		if (!menu) {
			throw createHttpError(404, 'Menu not found')
		}

		res.status(200).json(menu)
	} catch (error) {
		next(error)
	}
}

// Update a Menu by ID

interface UpdateMenuParams {
	menuId: string
}

interface UpdateMenuBody {
	name?: string
}

export const updateMenu: RequestHandler<
	UpdateMenuParams,
	unknown,
	UpdateMenuBody,
	unknown
> = async (req, res, next) => {
	const userId = req.session.userId
	const menuId = req.params.menuId
	const { name } = req.body

	try {
		assertIsDefined(userId)

		if (!mongoose.isValidObjectId(menuId)) {
			throw createHttpError(400, 'Invalid menu ID')
		}

		if (!name) {
			throw createHttpError(400, 'Name is required')
		}

		const menu = await MenuModel.findOneAndUpdate(
			{ _id: menuId, user: userId },
			{ name },
			{ new: true }
		).exec()

		if (!menu) {
			throw createHttpError(404, 'Menu not found')
		}

		res.status(200).json(menu)
	} catch (error) {
		next(error)
	}
}

// Delete a Menu by ID

export const deleteMenu: RequestHandler = async (req, res, next) => {
	const userId = req.session.userId
	const menuId = req.params.menuId

	try {
		assertIsDefined(userId)

		if (!mongoose.isValidObjectId(menuId)) {
			throw createHttpError(400, 'Invalid menu ID')
		}

		const menu = await MenuModel.findOneAndDelete({
			_id: menuId,
			user: userId,
		}).exec()

		if (!menu) {
			throw createHttpError(404, 'Menu not found')
		}

		res.status(204).end()
	} catch (error) {
		next(error)
	}
}
