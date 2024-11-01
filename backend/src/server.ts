import app from './app'
import env from './util/validateEnv'
import mongoose from 'mongoose'
const PORT = env.PORT

mongoose
	.connect(env.MONGO_URI || 'mongodb://mongodb/eatyq')
	.then(() => {
		console.log('Connected to MongoDB')
		app.listen(PORT!, () => {
			console.log(`Server is running on http://localhost:${PORT}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})
