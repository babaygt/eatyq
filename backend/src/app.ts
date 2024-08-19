import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import userRoutes from './routes/user'
import menuRoutes from './routes/menu'
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import env from './util/validateEnv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsOptions from './config/corsOptions'

const app = express()

app.use(morgan('dev'))

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_URI,
		}),
	})
)

app.use('/api/users', userRoutes)
app.use('/api/menus', menuRoutes)

app.use((req, res, next) => {
	const error = createHttpError(404, 'Not found')
	next(error)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
	if (isHttpError(err)) {
		res.status(err.statusCode).send(err.message)
	} else {
		console.error(err)
		res.status(500).send('Internal Server Error')
	}
})

app.get('/', (req, res) => {
	res.send('Hello World!')
})

export default app
