import express from "express"
import dbConnect from "./config/dbconnect"
import initRoutes from "./routes"
import cookieParser from "cookie-parser"
import cors from "cors"
import { OrderController } from "./controllers"
import http from "http" // Import http
import configureSocket from "./config/socket"
import logVisit from "./middlewares/logVisit"

require("dotenv").config()

dbConnect()
	.then(() => {
		const app = express()
		const port = process.env.PORT || 8000

		// Create HTTP server instance
		const server = http.createServer(app)

		// Initialize Socket.io
		const io = configureSocket(server)
		app.set("io", io) // Storing io in the app locals

		console.log("Initializing Express app...")

		app.use(
			cors({
				credentials: true,
				origin: [process.env.CLIENT_URL as string],
				methods: ["POST", "PUT", "GET", "DELETE"],
			})
		)
		app.use(cookieParser())
		app.post(
			"/stripe/webhook",
			express.raw({ type: "application/json" }),
			OrderController.handleWebhook
		)
		// Apply JSON body parser for other routes
		app.use(express.json())
		app.use(express.urlencoded({ extended: true }))

		initRoutes(app) // Register routes
		server.listen(port, () => {
			console.log("Server is running on port " + port)
		})
	})
	.catch((error) => {
		// Handle database connection error
		console.error("Failed to connect to the database:", error)
		process.exit(1) // Exit the process in case of a database connection error
	})
