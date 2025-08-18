import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		notifications: [
			{
				message: { type: String, required: true },
				isRead: { type: Boolean, default: false }, // Track if the user has read it
				product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
)

const NotifyModel = mongoose.model("Notify", notificationSchema)
export { NotifyModel as Notify }
