import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import UserModel from '../models/user'
import bcrypt from 'bcrypt'

interface CreateUserBody {
	username?: string
	email?: string
	password?: string
}

export const createUser: RequestHandler<
	unknown,
	unknown,
	CreateUserBody,
	unknown
> = async (req, res, next) => {
	const { username, email, password } = req.body

	try {
		if (!username) {
			throw createHttpError(400, 'Username is required')
		}

		if (!email) {
			throw createHttpError(400, 'Email is required')
		}

		if (!password) {
			throw createHttpError(400, 'Password is required')
		}

		const existingUserName = await UserModel.findOne({
			username: username,
		}).exec()

		if (existingUserName) {
			throw createHttpError(
				409,
				'Username already exists. Please choose another one.'
			)
		}

		const existingEmail = await UserModel.findOne({ email: email }).exec()

		if (existingEmail) {
			throw createHttpError(
				409,
				'Email already exists. Please choose another one.'
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = await UserModel.create({
			username,
			email,
			password: hashedPassword,
		})

		req.session.userId = user._id

		res.status(201).json({
			username: user.username,
			email: user.email,
		})
	} catch (error) {
		next(error)
	}
}

interface LoginUserBody {
	email?: string
	password?: string
}

export const loginUser: RequestHandler<
	unknown,
	unknown,
	LoginUserBody,
	unknown
> = async (req, res, next) => {
	const { email, password } = req.body

	try {
		if (!email || !password) {
			throw createHttpError(400, 'Missing required fields')
		}

		const user = await UserModel.findOne({ email: email })
			.select('+password')
			.exec()

		if (!user) {
			throw createHttpError(401, 'Invalid email or password')
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			throw createHttpError(401, 'Invalid email or password')
		}

		req.session.userId = user._id

		res.status(200).json({
			username: user.username,
			email: user.email,
		})
	} catch (error) {
		next(error)
	}
}

export const getCurrentUser: RequestHandler = async (req, res, next) => {
	try {
		if (!req.session.userId) {
			throw createHttpError(401, 'Unauthorized')
		}

		const user = await UserModel.findById(req.session.userId).exec()

		if (!user) {
			throw createHttpError(404, 'User not found')
		}

		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

export const logoutUser: RequestHandler = (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error)
		} else {
			res.sendStatus(200)
		}
	})
}
