import mongoose, { Document, Schema } from "mongoose"
import { User } from "./user.model"

interface IRating {
	star: number
	postedBy: mongoose.Types.ObjectId | string
	comment: string
	updatedAt: Date
}

interface IVariant {
	_id: mongoose.Types.ObjectId | string
	stock: number
	price?: number
	[key: string]: any
}

interface IProduct extends Document {
	title: string
	slug: string
	description?: string
	brand: mongoose.Types.ObjectId | string
	price: number
	category: mongoose.Types.ObjectId | string
	quantity: number
	sold: number
	images: string[]
	ratings: IRating[]
	totalRatings: number
	thumbnail: string
	allowVariants: boolean
	variants: IVariant[] | null
	publicProduct: boolean
	deleted: boolean
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
		thumbnail: { type: String, trim: true },
		description: { type: String, trim: true },
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductBrand",
			required: true,
		},
		price: { type: Number, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductCategory",
			required: true,
		},
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
		variants: { type: [Schema.Types.Mixed], _id: true, default: [] },
		publicProduct: { type: Boolean, required: true, default: false },
		deleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

productSchema.pre<IProduct>(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		const productId = this._id
		await User.updateMany({}, { $pull: { cart: { "product._id": productId } } })
		next()
	}
)

productSchema.methods.removeVariant = async function (
	variantId: mongoose.Types.ObjectId
) {
	await User.updateMany(
		{},
		{ $pull: { cart: { "product.variant._id": variantId } } }
	)
}

const ProductModel = mongoose.model<IProduct>("Product", productSchema)

export { ProductModel as Product, IRating, IProduct, IVariant }
