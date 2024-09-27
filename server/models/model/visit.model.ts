import mongoose from "mongoose"

const visitSchema = new mongoose.Schema({
	ip: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Associate with user if logged in
	visitDate: { type: Date, default: Date.now }, // Date of the visit
})

const VisitModel = mongoose.model("Visit", visitSchema)
export { VisitModel as Visit }
