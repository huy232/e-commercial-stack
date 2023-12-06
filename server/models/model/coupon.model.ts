import mongoose from "mongoose" // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		coupon: {
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
const CouponModel = mongoose.model("Coupon", couponSchema)

export { CouponModel as Coupon }
