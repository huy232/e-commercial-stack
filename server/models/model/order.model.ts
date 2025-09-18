import mongoose, { Document, Schema } from "mongoose"

interface IAddress {
	name?: string
	phone?: string
	address: {
		line1: string
		line2?: string
		city?: string
		state?: string
		postal_code?: string
		country?: string
	}
}

interface IOrder extends Document {
	products: []
	status: "Cancelled" | "Processing" | "Success" | "Refund" | "Delivering"
	total: number
	coupon: mongoose.Schema.Types.ObjectId | null
	orderBy: mongoose.Schema.Types.ObjectId
	visible: boolean
	notes?: string
	shippingAddress?: IAddress
}

const addressSchema = new Schema(
	{
		name: { type: String, required: true },
		country: { type: String, required: true },
		line1: { type: String, required: true },
		line2: { type: String },
		city: { type: String, required: true },
		state: { type: String, required: true },
		postal_code: { type: String, required: true },
		phone: { type: String, required: true },
		isDefault: { type: Boolean, default: false },
	},
	{ _id: true }
)

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
		notes: { type: String, default: "" },
		shippingAddress: { type: addressSchema, default: null },
	},
	{ timestamps: true }
)

const orderModel = mongoose.model<IOrder>("Order", orderSchema)

export { orderModel as Order, IOrder }
