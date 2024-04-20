import mongoose, { Document, Schema } from "mongoose"

interface IRating {
	star: number
	postedBy: mongoose.Types.ObjectId | string
	comment: string
	updatedAt: Date
}

interface IVariant {
	[key: string]: string | number | undefined
	stock: number
	price?: number
}

interface IProduct extends Document {
	title: string
	slug: string
	description?: string
	brand: string
	price: number
	category: string[]
	quantity: number
	sold: number
	images: string[]
	ratings: IRating[]
	totalRatings: number
	thumbnail: string
	allowVariants: boolean
	variants: IVariant[] | null
	public: boolean
}

const productSchema = new Schema<IProduct>(
	{
		title: { type: String, required: true, trim: true },
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: { type: String, trim: true },
		brand: { type: String, required: true, trim: true },
		thumbnail: { type: String },
		price: { type: Number, required: true },
		category: { type: [String], required: true },
		quantity: { type: Number, default: 0 },
		sold: { type: Number, default: 0 },
		images: { type: [String] },
		ratings: [
			{
				star: { type: Number },
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				comment: { type: String },
				updatedAt: { type: Date },
			},
		],
		totalRatings: { type: Number, default: 0 },
		allowVariants: { type: Boolean, required: true },
		variants: [{ type: Schema.Types.Mixed }],
		public: { type: Boolean, required: true },
	},
	{ timestamps: true }
)

const ProductModel = mongoose.model<IProduct>("Product", productSchema)

export { ProductModel as Product, IRating, IProduct }
