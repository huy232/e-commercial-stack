// models/ChatSession.ts
import mongoose, { Schema, Document, Types } from "mongoose"

export interface IChatSession extends Document {
	clientId: Types.ObjectId | string
	clientName?: string
	isGuest: boolean

	adminId: Types.ObjectId | string | null
	adminName?: string
	isAdminGuest: boolean

	lastMessageAt?: Date
	createdAt: Date
	updatedAt: Date
}

const chatSessionSchema = new Schema<IChatSession>(
	{
		clientId: { type: Schema.Types.Mixed, required: true },
		clientName: { type: String }, // e.g. "John (Guest)" or "Alice"

		isGuest: { type: Boolean, required: true },

		adminId: { type: Schema.Types.Mixed, default: null },
		adminName: { type: String },

		isAdminGuest: { type: Boolean, default: false },

		lastMessageAt: { type: Date },
	},
	{ timestamps: true }
)

const ChatSessionModel = mongoose.model<IChatSession>(
	"ChatSession",
	chatSessionSchema
)
export { ChatSessionModel as ChatSession }
