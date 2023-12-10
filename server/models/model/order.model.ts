import mongoose, { Document } from "mongoose"
import { IProduct } from "./product.model"

interface IOrder extends Document {
	products: IProduct[]
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	total: Number
	coupon: mongoose.Schema.Types.ObjectId
	orderBy: mongoose.Schema.Types.ObjectId // Correct type for 'orderBy'
}

var orderSchema = new mongoose.Schema<IOrder>({
	products: [
		{
			product: { type: mongoose.Types.ObjectId, ref: "Product" },
			count: Number,
			color: String,
		},
	],
	status: {
		type: String,
		default: "Processing",
		enum: ["Cancelled", "Processing", "Success", "Refund", "Delivering"],
	},
	total: Number,
	coupon: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Coupon",
	},
	orderBy: {
		type: mongoose.Schema.Types.ObjectId, // Correct type for 'orderBy'
		ref: "User",
	},
})

const orderModel = mongoose.model<IOrder>("Order", orderSchema)

export { orderModel as Order, IOrder }
