import mongoose, { Document, Types } from "mongoose"

interface User extends Document {
	firstName: string
	lastName: string
	email: string
	mobile: string
	password: string
	role: string[]
	cart: Types.ObjectId[]
	address: Types.ObjectId[]
	wishlist: Types.ObjectId[]
	isBlocked: boolean
	refreshToken?: string
	passwordChangedAt?: string
	passwordResetToken?: string
	passwordResetExpired?: string
	createdAt: Date
	updatedAt: Date
}

var userSchema = new mongoose.Schema<User>(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: [String],
			default: ["user"],
		},
		cart: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
			default: [],
		},
		address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
		wishlist: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Product",
			},
		],
		isBlocked: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
		passwordChangedAt: {
			type: String,
		},
		passwordResetToken: {
			type: String,
		},
		passwordResetExpired: {
			type: String,
		},
	},
	{ timestamps: true }
)

const UserModel = mongoose.model<User>("User", userSchema)

export default UserModel
