import mongoose, { Document, Types } from "mongoose"

interface IUser {
	_id: Types.ObjectId
	// Add other user properties if needed
}

interface IBlog extends Document {
	title: string
	description: string
	category: string
	numberViews: number
	likes: Types.ObjectId[] | IUser[]
	dislikes: Types.ObjectId[] | IUser[]
	image: string
	author: string
	createdAt: Date
	updatedAt: Date
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
		category: {
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
			default:
				"https://oymwwlqfxvnemaewrjza.supabase.co/storage/v1/object/public/Images/bg-wallpaper.jpg?t=2023-12-05T10%3A12%3A42.593Z",
		},
		author: {
			type: String,
			default: "Admin",
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

export { BlogModel as Blog }
