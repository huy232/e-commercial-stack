import mongoose, { Document } from "mongoose"
import slugify from "slugify"
import { Blog } from "./blog.model"

interface IBlogCategory extends Document {
	title: string
	slug: string
	createdAt: Date
	updatedAt: Date
	description: string
}

const blogCategorySchema = new mongoose.Schema<IBlogCategory>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		slug: {
			type: String,
			unique: true,
			index: true,
			default: function (this: { title: string }) {
				return slugify(this.title, { lower: true, strict: true })
			},
		},
		description: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
)

blogCategorySchema.pre("findOneAndDelete", async function (next) {
	const category = await this.model.findOne(this.getFilter())
	if (!category) return next()

	await Blog.updateMany(
		{ relatedBlogCategory: category._id },
		{ $set: { relatedBlogCategory: null } }
	)

	next()
})

const BlogCategoryModel = mongoose.model<IBlogCategory>(
	"BlogCategory",
	blogCategorySchema
)

export { BlogCategoryModel as BlogCategory, IBlogCategory }
