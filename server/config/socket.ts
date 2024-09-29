import { Server } from "socket.io"
import http from "http"

let activeUsers = 0
let loggedInUsers = 0
let io: Server | null = null

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
		// Increase active users when someone connects
		activeUsers++
		console.log("New client connected:", socket.id)

		// Notify all clients about the current active users
		io!.emit("userCountUpdated", { activeUsers, loggedInUsers }) // Use io! to assert non-null

		socket.on("userLoggedIn", () => {
			loggedInUsers++
			io!.emit("userCountUpdated", { activeUsers, loggedInUsers }) // Use io! to assert non-null
		})

		socket.on("disconnect", () => {
			activeUsers--
			console.log("Client disconnected:", socket.id)
			io!.emit("userCountUpdated", { activeUsers, loggedInUsers }) // Use io! to assert non-null
		})

		socket.on("userLoggedOut", () => {
			loggedInUsers--
			io!.emit("userCountUpdated", { activeUsers, loggedInUsers }) // Use io! to assert non-null
		})
	})

	return io
}

export { activeUsers, loggedInUsers }
export default configureSocket
