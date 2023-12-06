import mongoose, { Document, Types, Schema } from "mongoose"

interface IRating {
	star: number
	postedBy: mongoose.Types.ObjectId | Types.ObjectId | string
	comment: string
}

interface IProduct extends Document {
	title: string
	slug: string
	description?: string
	brand: string
	price: number
	category: mongoose.Types.ObjectId | Types.ObjectId | string
	quantity: number
	sold: number
	images: string[]
	color: "Black" | "Red" | "White"
	ratings: IRating[]
	totalRatings: number
}

var productSchema = new mongoose.Schema<IProduct>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		brand: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		images: {
			type: [String],
		},
		color: {
			type: String,
			enum: ["Black", "Red", "White"],
		},
		ratings: [
			{
				star: { type: Number },
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				comment: { type: String },
			},
		],
		totalRatings: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
)

const ProductModel = mongoose.model<IProduct>("Product", productSchema)

export { ProductModel as Product }
