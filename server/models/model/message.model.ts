// models/Message.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IMessage extends Document {
	chatSession: mongoose.Types.ObjectId
	sender: string // can be adminId or clientId
	message: string
	createdAt: Date
}

const messageSchema = new Schema<IMessage>(
	{
		chatSession: {
			type: Schema.Types.ObjectId,
			ref: "ChatSession",
			required: true,
		},
		sender: { type: String, required: true },
		message: { type: String, required: true },
	},
	{ timestamps: true }
)

const MessageModel = mongoose.model<IMessage>("Message", messageSchema)
export { MessageModel as Message }
