import express from "express"
import dbConnect from "./config/dbconnect"
import initRoutes from "./routes"
import cookieParser from "cookie-parser"

require("dotenv").config()

dbConnect()
	.then(() => {
		const app = express()
		const port = process.env.PORT || 8000

		app.use(cookieParser())
		app.use(express.json())
		app.use(express.urlencoded({ extended: true }))
		app.listen(port, () => {
			console.log("Server is running on port " + port)
		})
		initRoutes(app)
	})
	.catch((error) => {
		// Handle database connection error
		console.error("Failed to connect to the database:", error)
		process.exit(1) // Exit the process in case of a database connection error
	})
