import mongoose, { Types } from "mongoose"
import { IProduct } from "./product.model"

interface IPaymentIntent {
	// Define properties related to payment (e.g., paymentId, paymentStatus, etc.)
}

interface IOrder extends Document {
	products: IProduct[]
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	paymentIntent: IPaymentIntent
	orderBy: Types.ObjectId
}

var orderSchema = new mongoose.Schema({
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
	paymentIntent: {},
	orderBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
})

const orderModel = mongoose.model<IOrder>("Order", orderSchema)

export { orderModel as Order, IPaymentIntent, IOrder }
