import express from 'express'
import * as UserController from '../controllers/user'
import { checkAuth } from '../middleware/auth'

const router = express.Router()

router.get('/me', checkAuth, UserController.getCurrentUser)

router.post('/register', UserController.createUser)

router.post('/login', UserController.loginUser)

router.post('/logout', checkAuth, UserController.logoutUser)

export default router
