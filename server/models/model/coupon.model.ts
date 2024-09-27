import mongoose, { Document, Schema } from "mongoose"

interface ICoupon extends Document {
	name: string
	code: string
	discount: number
	discountType: "fixed" | "percentage"
	expiry?: Date
	usageLimit?: number
	usedCount: number
	activeCouple: boolean // New field
	isValid(): boolean
}

const couponSchema = new Schema<ICoupon>(
	{
		name: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		discountType: {
			type: String,
			enum: ["fixed", "percentage"],
			required: true,
		},
		expiry: {
			type: Date,
		},
		usageLimit: {
			type: Number,
		},
		usedCount: {
			type: Number,
			default: 0,
		},
		activeCouple: {
			type: Boolean,
			default: true, // Default value for the new field
		},
	},
	{ timestamps: true }
)

couponSchema.methods.isValid = function () {
	const now = new Date()
	if (this.expiry && this.expiry < now) {
		return false
	}
	if (this.usageLimit && this.usedCount >= this.usageLimit) {
		return false
	}
	return this.activeCouple // Check the active status
}

// Export the model
const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema)

export { CouponModel as Coupon, ICoupon }
