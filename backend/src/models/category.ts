import { Schema, Types, model } from 'mongoose'

export interface ICategory {
	menu: Types.ObjectId
	name: string
	items?: Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
	{
		menu: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
		name: { type: String, required: true },
		items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
	},
	{
		timestamps: true,
	}
)

export default model<ICategory>('Category', CategorySchema)
