import mongoose, { Document, Types } from "mongoose"
import crypto from "crypto"
import * as bcrypt from "bcrypt"

interface ICartItem {
	product: mongoose.Document | string
	quantity: number
	color: string
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

var userSchema = new mongoose.Schema<IUser>(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		avatar: {
			type: String,
		},
		mobile: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: [String],
			default: ["user"],
		},
		cart: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				quantity: Number,
				color: String,
				price: Number,
			},
		],
		address: {
			type: [],
			default: [],
		},
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
		registerToken: {
			type: String,
		},
	},
	{ timestamps: true }
)

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next()
	}
	this.password = await bcrypt.hash(this.password, 10)
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

export { UserModel as User, IUser, ICartItem }
