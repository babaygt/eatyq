import { cleanEnv, port, str } from 'envalid'

export default cleanEnv(process.env, {
	MONGO_URI: str({ default: 'mongodb://mongodb/eatyq' }),
	PORT: port(),
	SESSION_SECRET: str(),
})
