import mongoose, { Document, Types, Schema } from "mongoose"
import crypto from "crypto"
import * as bcrypt from "bcrypt"
import { IProduct, IVariant } from "./product.model"

interface ICartItem {
	product_id: mongoose.Types.ObjectId | string
	variant_id?: mongoose.Types.ObjectId | string
	quantity: number
}

interface ICartItemPopulate {
	product: IProduct
	variant?: IVariant
	quantity: number
}

interface IUser extends Document {
	firstName: string
	lastName: string
	email: string
	mobile: string
	avatar: string
	password: string
	role: string[]
	cart: ICartItem[]
	address: string[]
	wishlist: Types.ObjectId[]
	isBlocked: boolean
	refreshToken?: string
	passwordChangedAt?: string
	passwordResetToken?: string
	passwordResetExpired?: string
	createdAt: Date
	updatedAt: Date
	registerToken: string

	createPasswordChangedToken(): string
	isCorrectPassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
	{
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		avatar: { type: String },
		mobile: { type: String, trim: true },
		password: { type: String, required: true, trim: true },
		role: { type: [String], default: ["user"] },
		cart: [
			{
				product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				variant_id: { type: mongoose.Schema.Types.ObjectId },
				quantity: { type: Number },
			},
		],
		address: { type: [], default: [] },
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		isBlocked: { type: Boolean, default: false },
		refreshToken: { type: String },
		passwordChangedAt: { type: String },
		passwordResetToken: { type: String },
		passwordResetExpired: { type: String },
		registerToken: { type: String },
	},
	{ timestamps: true }
)

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next()
	}
	this.password = await bcrypt.hash(this.password, 10)
	next()
})

userSchema.methods = {
	isCorrectPassword: async function (password: string) {
		return await bcrypt.compare(password, this.password)
	},
	createPasswordChangedToken: function () {
		const resetToken = crypto.randomBytes(32).toString("hex")
		this.passwordResetToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex")
		this.passwordResetExpired = (Date.now() + 15 * 60 * 1000).toString()
		return resetToken
	},
}

const UserModel = mongoose.model<IUser>("User", userSchema)

export { UserModel as User, IUser, ICartItem, ICartItemPopulate }
