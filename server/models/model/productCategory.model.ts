import mongoose, { Document, Schema } from "mongoose"

interface IProductCategory extends Document {
	title: string
	slug: string
	brand: mongoose.Types.ObjectId[] // Reference to ProductBrand
	image?: string
	createdAt: Date
	updatedAt: Date
	option: { type: string; value: string[] }[]
}

const productCategorySchema = new Schema<IProductCategory>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		brand: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Brand",
			},
		],
		image: {
			type: String,
		},
		option: [
			{
				type: {
					type: String,
					trim: true,
					unique: true,
				},
				value: {
					type: [String],
					trim: true,
				},
			},
		],
	},
	{ timestamps: true }
)

const ProductCategoryModel = mongoose.model<IProductCategory>(
	"ProductCategory",
	productCategorySchema
)

export { ProductCategoryModel as ProductCategory, IProductCategory }
