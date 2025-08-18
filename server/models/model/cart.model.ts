import mongoose, { Document, Schema } from "mongoose"

interface ICartItem {
	product_id: mongoose.Types.ObjectId | string
	variant_id?: mongoose.Types.ObjectId | string
	quantity: number
}

interface ICart extends Document {
	user_id?: mongoose.Types.ObjectId | string // Optional for guest carts
	items: ICartItem[]
	createdAt: Date
	updatedAt: Date
}

const cartSchema = new Schema<ICart>(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		items: [
			{
				product_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				variant_id: {
					type: mongoose.Schema.Types.ObjectId,
					required: false,
				},
				quantity: { type: Number, required: true, min: 1 },
			},
		],
	},
	{ timestamps: true }
)

const CartModel = mongoose.model<ICart>("Cart", cartSchema)

export { CartModel as Cart, ICart, ICartItem }
