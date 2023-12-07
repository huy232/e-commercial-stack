import mongoose from "mongoose"

interface ICoupon extends Document {
	name: string
	discount: number
	expiry: Date
}

var couponSchema = new mongoose.Schema<ICoupon>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		expiry: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
)

//Export the model
const CouponModel = mongoose.model<ICoupon>("Coupon", couponSchema)

export { CouponModel as Coupon, ICoupon }
