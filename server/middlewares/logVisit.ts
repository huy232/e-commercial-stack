import { Request, Response, NextFunction } from "express"
import { Visit } from "../models"
import { AuthenticatedRequest } from "../types/user"

const logVisit = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const ip = req.ip || req.connection.remoteAddress // Get IP address of the visitor
		const user = req.user ? req.user._id : null // Check if the user is logged in

		await Visit.create({ ip, user })
	} catch (error) {
		console.error("Error logging visit:", error)
	}

	next()
}

export default logVisit
