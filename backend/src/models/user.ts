import { model, Schema } from 'mongoose'

export interface IUser {
	username: string
	email: string
	password: string
	updatedAt: Date
	createdAt: Date
}

const UserSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
	},
	{
		timestamps: true,
	}
)

export default model<IUser>('User', UserSchema)
