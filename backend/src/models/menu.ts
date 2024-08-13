import { Schema, Types, model } from 'mongoose'

export interface IMenu {
	user: Types.ObjectId
	name: string
	categories?: Types.ObjectId[]
}

const MenuSchema = new Schema<IMenu>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true },
		categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	},
	{
		timestamps: true,
	}
)

export default model<IMenu>('Menu', MenuSchema)
