import mongoose, { Document, Schema } from "mongoose"

interface IOrder extends Document {
	products: []
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	total: number
	coupon: mongoose.Schema.Types.ObjectId | null
	orderBy: mongoose.Schema.Types.ObjectId
	visible: boolean
}

const orderSchema = new Schema<IOrder>(
	{
		products: { type: [], required: true },
		status: {
			type: String,
			default: "Processing",
			enum: ["Cancelled", "Processing", "Success", "Refund", "Delivering"],
		},
		total: { type: Number, required: true },
		coupon: { type: mongoose.Types.ObjectId, ref: "Coupon", default: null },
		orderBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
		visible: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
)
const orderModel = mongoose.model<IOrder>("Order", orderSchema)

export { orderModel as Order, IOrder }
