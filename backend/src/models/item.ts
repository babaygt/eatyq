import { Schema, Types, model } from 'mongoose'

export interface IItem {
	category: Types.ObjectId
	name: string
	description?: string
	price: number
	imageUrl?: string
	variations?: {
		name: string
		price?: number
	}[]
	createdAt: Date
	updatedAt: Date
}

const ItemSchema = new Schema<IItem>(
	{
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		name: { type: String, required: true },
		description: { type: String },
		price: { type: Number, required: true },
		imageUrl: { type: String },
		variations: [
			{
				name: { type: String, required: true },
				price: { type: Number },
			},
		],
	},
	{
		timestamps: true,
	}
)

export default model<IItem>('Item', ItemSchema)
