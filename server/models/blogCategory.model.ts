import mongoose from "mongoose" // Erase if already required

// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema(
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
const BlogCategoryModel = mongoose.model("BlogCategory", blogCategorySchema)

export { BlogCategoryModel as BlogCategory }
