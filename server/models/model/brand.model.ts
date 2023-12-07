import mongoose from "mongoose" // Erase if already required

interface IBrand extends Document {
	title: string
	createdAt: Date
	updatedAt: Date
}

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema<IBrand>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
)

//Export the model
const BrandModel = mongoose.model<IBrand>("Brand", brandSchema)

export { BrandModel as Brand, IBrand }
