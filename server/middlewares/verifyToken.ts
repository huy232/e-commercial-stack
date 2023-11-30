import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { AuthenticatedRequest } from "../types/user"

const verifyAccessToken = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		if (req.headers.authorization?.startsWith("Bearer")) {
			const token = req.headers.authorization.split(" ")[1]
			jwt.verify(
				token,
				process.env.JWT_SECRET as string,
				(
					err: jwt.VerifyErrors | null,
					decode: string | jwt.JwtPayload | undefined
				) => {
					if (err)
						return res.status(401).json({
							success: false,
							message: "Invalid access token",
						})

					req.user = decode
					next()
				}
			)
		} else {
			res.status(401).json({
				success: false,
				message: "Authentication required",
			})
		}
	}
)

const isAdmin = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		const { role } = req.user
		if (role && role.includes("admin")) {
			next()
		} else {
			res.status(403).json({
				success: false,
				message: "Access denied. User is not an admin.",
			})
		}
	}
)

export { verifyAccessToken, isAdmin }
