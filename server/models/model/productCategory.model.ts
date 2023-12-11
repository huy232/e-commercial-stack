import mongoose from "mongoose"

interface IProductCategory extends Document {
	title: string
	brand: []
	createdAt: Date
	updatedAt: Date
}

var productCategorySchema = new mongoose.Schema<IProductCategory>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		brand: {
			type: [],
			required: true,
		},
	},
	{ timestamps: true }
)

//Export the model
const ProductCategoryModel = mongoose.model<IProductCategory>(
	"ProductCategory",
	productCategorySchema
)

export { ProductCategoryModel as ProductCategory, IProductCategory }
