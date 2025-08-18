import mongoose, { Document, Types } from "mongoose"

interface IUserBlog {
	_id: Types.ObjectId
	// Add other user properties if needed
}

interface IBlog extends Document {
	title: string
	description: string
	numberViews: number
	likes: Types.ObjectId[] | IUserBlog[]
	dislikes: Types.ObjectId[] | IUserBlog[]
	image: string
	author: Types.ObjectId | IUserBlog
	relatedProducts?: mongoose.Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
	slug: string
	relatedBlogCategory: mongoose.Types.ObjectId[] | null
}

var blogSchema = new mongoose.Schema<IBlog>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		numberViews: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],
		image: {
			type: String,
			default: "",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		relatedProducts: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Product",
			default: [],
		},
		relatedBlogCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BlogCategory",
			default: null,
		},
		slug: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,
			set: (v: string) => v.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

//Export the model
const BlogModel = mongoose.model<IBlog>("Blog", blogSchema)

export { BlogModel as Blog, IUserBlog, IBlog }
