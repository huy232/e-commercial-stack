import mongoose, { Document, Schema } from "mongoose"
import { ProductType } from "../../../client/types/product"

interface IDailyDeal extends Document {
	product: ProductType
	expirationTime: string
}

const dailyDealSchema = new mongoose.Schema<IDailyDeal>(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		expirationTime: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

const DailyDealModel = mongoose.model<IDailyDeal>("DailyDeal", dailyDealSchema)

export { DailyDealModel as DailyDeal, IDailyDeal }
