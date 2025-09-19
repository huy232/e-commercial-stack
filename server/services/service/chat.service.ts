import { ChatSession, Message } from "../../models"

function generateGuestName(): string {
	const randomId = Math.floor(100000 + Math.random() * 900000) // 6-digit number
	return `Guest-${randomId}`
}

class ChatService {
	// Create or return an existing chat session for a client
	async createOrGetChatSession({
		clientId,
		clientName,
		isGuest,
	}: {
		clientId: string
		clientName?: string
		isGuest: boolean
	}) {
		let session = await ChatSession.findOne({ clientId })

		if (!session) {
			const nameToUse =
				isGuest && (!clientName || clientName.trim() === "")
					? generateGuestName()
					: clientName || "User"

			session = await ChatSession.create({
				clientId,
				clientName: nameToUse,
				isGuest,
			})
		}

		return session
	}

	// Save a message to the database
	async saveMessage(chatRoomId: string, sender: string, message: string) {
		return await Message.create({
			chatSession: chatRoomId,
			sender,
			message,
		})
	}

	// Get messages for a given chat session, sorted oldest to newest
	async getMessagesBySession(roomId: string) {
		return await Message.find({ chatSession: roomId }).sort({ createdAt: 1 })
	}

	// Get a specific chat session (no more population needed)
	async getChatSessionById(roomId: string) {
		return await ChatSession.findById(roomId)
	}
}

export default new ChatService()
