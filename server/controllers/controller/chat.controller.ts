import { Request, Response } from "express"
import { ChatService } from "../../services"
import { ChatSession, Message } from "../../models"
import { AuthenticatedRequest } from "../../types/user"

class ChatController {
	async startChat(req: Request, res: Response) {
		try {
			const { clientId, clientName, isGuest } = req.body

			if (!clientId) {
				return res.status(400).json({ error: "Missing clientId" })
			}

			const session = await ChatService.createOrGetChatSession({
				clientId,
				clientName,
				isGuest,
			})

			res.json(session)
		} catch (error) {
			console.error(error)
			res.status(500).json({ success: false, message: "Failed to start chat" })
		}
	}

	async sendMessage(req: Request, res: Response) {
		try {
			const { roomId, sender, message } = req.body

			const savedMessage = await ChatService.saveMessage(
				roomId,
				sender,
				message
			)

			// Update lastMessageAt
			await ChatSession.findByIdAndUpdate(roomId, {
				lastMessageAt: new Date(),
			})

			const io = req.app.get("io")
			io.to(roomId).emit("newMessage", savedMessage)

			res.status(201).json({
				success: true,
				message: "Message sent",
				data: savedMessage,
			})
		} catch (error) {
			console.error(error)
			res
				.status(500)
				.json({ success: false, message: "Failed to send message" })
		}
	}

	async getMessages(req: Request, res: Response) {
		try {
			const { sessionId } = req.params
			const messages = await ChatService.getMessagesBySession(sessionId)

			res.status(200).json({ success: true, messages })
		} catch (error) {
			console.error(error)
			res
				.status(500)
				.json({ success: false, message: "Failed to get messages" })
		}
	}

	async getChatSession(req: Request, res: Response) {
		try {
			const { sessionId } = req.params

			const session = await ChatService.getChatSessionById(sessionId)
			if (!session) {
				return res
					.status(404)
					.json({ success: false, message: "Session not found" })
			}

			const messages = await Message.find({ chatSession: sessionId }).sort({
				timestamp: 1,
			})

			res.status(200).json({
				success: true,
				sessionId: session._id,
				messages,
			})
		} catch (error) {
			console.error(error)
			res
				.status(500)
				.json({ success: false, message: "Failed to get chat session" })
		}
	}

	async getChatRooms(req: Request, res: Response) {
		try {
			const rooms = await ChatSession.find({
				$or: [
					{ adminId: null },
					{ updatedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60) } },
				],
			}).sort({ updatedAt: -1 })

			return res.status(200).json(rooms)
		} catch (error) {
			console.error("Error getting chat rooms:", error)
			return res.status(500).json({ message: "Failed to fetch chat rooms" })
		}
	}

	async getAllChatRooms(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 10
			const skip = (page - 1) * limit

			const total = await ChatSession.countDocuments()
			const chatRooms = await ChatSession.find()
				.skip(skip)
				.limit(limit)
				.sort({ updatedAt: -1 })

			return res.status(200).json({
				rooms: chatRooms,
				total,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
			})
		} catch (error) {
			console.log("Error getting all chat rooms: ", error)
			return res.status(500).json({ message: "Failed to fetch rooms" })
		}
	}

	async assignAdminToRoom(req: AuthenticatedRequest, res: Response) {
		try {
			const { sessionId } = req.params
			const adminId = req.user?._id
			const adminName = req.user?.name || "Admin"
			const isAdminGuest = false // or detect guest from your logic

			if (!adminId) return res.status(401).json({ message: "Unauthorized" })

			const session = await ChatSession.findById(sessionId)
			if (!session)
				return res.status(404).json({ message: "Session not found" })

			session.adminId = adminId
			session.adminName = adminName
			session.isAdminGuest = isAdminGuest
			await session.save()

			return res.status(200).json(session)
		} catch (err) {
			console.error("Error assigning admin:", err)
			res.status(500).json({ message: "Failed to assign admin" })
		}
	}
}

export default new ChatController()
