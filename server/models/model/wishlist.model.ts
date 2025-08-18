import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Associate with user if logged in
		items: [
			{
				product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				_id: false,
			},
		],
	},
	{ timestamps: true }
)

const WishlistModel = mongoose.model("Wishlist", wishlistSchema)
export { WishlistModel as Wishlist }
