import mongoose, { Document, Schema } from "mongoose"

interface IProductVariant extends Document {
	title: string
	createdAt: Date
	updatedAt: Date
}

const productVariantSchema = new Schema<IProductVariant>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
	},
	{ timestamps: true }
)

const ProductVariantModel = mongoose.model<IProductVariant>(
	"ProductVariant",
	productVariantSchema
)

export { ProductVariantModel as ProductBrand, IProductVariant }
