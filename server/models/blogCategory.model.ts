import mongoose from "mongoose"

interface IBlogCategory extends Document {
	title: string
	createdAt: Date
	updatedAt: Date
}
var blogCategorySchema = new mongoose.Schema<IBlogCategory>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
	},
	{ timestamps: true }
)

//Export the model
const BlogCategoryModel = mongoose.model<IBlogCategory>(
	"BlogCategory",
	blogCategorySchema
)

export { BlogCategoryModel as BlogCategory }
