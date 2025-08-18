import { Server } from "socket.io"
import http from "http"
import { ChatSession, Message } from "../models"

let io: Server | null = null
const userSockets = new Map<string, string>()

const configureSocket = (server: http.Server) => {
	if (io) {
		console.log("Socket server is already initialized.")
		return io
	}

	io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URL,
			methods: ["POST", "PUT", "GET", "DELETE"],
			credentials: true,
		},
	})

	io.on("connection", (socket) => {
		socket.on("registerUser", (userId: string) => {
			if (!userId) return
			for (const [id, socketId] of userSockets.entries()) {
				if (id === userId) {
					userSockets.delete(id)
					break
				}
			}
			userSockets.set(userId, socket.id) // Store user ID with socket ID
			console.log(`User ${userId} registered with socket ${socket.id}`)
		})

		// Notify all clients about the current active users

		socket.on("userLoggedIn", () => {})

		socket.on("joinRoom", (chatSessionId) => {
			socket.join(chatSessionId)
			console.log(`Socket ${socket.id} joined room: ${chatSessionId}`)
		})

		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id)
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					userSockets.delete(userId)
					break
				}
			}
		})
		socket.on("join", (roomId) => {
			socket.join(roomId)
		})

		socket.on("sendMessage", async ({ roomId, sender, message }) => {
			if (!roomId) return

			const savedMessage = await Message.create({
				chatSession: roomId,
				sender,
				message,
			})

			await ChatSession.findByIdAndUpdate(roomId, {
				lastMessageAt: new Date(),
			})

			if (io) {
				io.to(roomId).emit("newMessage", savedMessage) // 👈 Change to "newMessage"
			}
		})

		socket.on("userLoggedOut", () => {})
	})

	return io
}

export { userSockets }
export default configureSocket
