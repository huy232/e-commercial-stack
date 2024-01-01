import jwt, { JwtPayload } from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { AuthenticatedRequest } from "../types/user"
import { generateAccessToken } from "./jwt"

const verifyToken = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
	tokenType: string
): Promise<void> => {
	try {
		const cookies = req.headers.cookie

		if (cookies) {
			const cookieArray = cookies.split("; ")
			const tokenCookie = cookieArray.find((cookie) =>
				cookie.startsWith(`${tokenType}=`)
			)

			if (tokenCookie) {
				const token = tokenCookie.split("=")[1]

				const decoded = await jwt.verify(
					token,
					process.env.JWT_SECRET as string
				)

				req.user = decoded
				next()
			} else {
				res.status(401).json({
					success: false,
					message: `No ${tokenType} token found in cookies`,
				})
			}
		} else {
			res.status(401).json({
				success: false,
				message: "No cookies found",
			})
		}
	} catch (error) {
		res.status(401).json({
			success: false,
			message: `Invalid ${tokenType} token`,
		})
	}
}

const verifyAccessToken = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		const cookies = req.headers.cookie

		if (cookies) {
			const cookieArray = cookies.split("; ")
			const tokenCookie = cookieArray.find((cookie) =>
				cookie.startsWith("accessToken=")
			)

			if (!tokenCookie && req.cookies.refreshToken) {
				// If no access token is found, but refresh token is present, attempt to refresh
				try {
					const responseToken = await jwt.verify(
						req.cookies.refreshToken,
						process.env.JWT_SECRET as string
					)

					const jwtPayload = responseToken as JwtPayload
					const newAccessToken = generateAccessToken(
						jwtPayload._id,
						jwtPayload.role
					)

					// Include the new access token in the response
					res.cookie("accessToken", newAccessToken, {
						httpOnly: true,
						maxAge: 60 * 1000, // Set the new access token's expiration time
						sameSite: "none",
						secure: true,
					})

					// Continue with the request using the new access token
					req.user = jwt.verify(
						newAccessToken,
						process.env.JWT_SECRET as string
					)
					next()
				} catch (refreshError) {
					// Handle refresh token verification error
					console.error("Error during verify refresh token:", refreshError)
					res.status(401).json({
						success: false,
						message: "Both access and refresh tokens are expired",
					})
				}
			} else if (tokenCookie) {
				const accessToken = tokenCookie.split("=")[1]

				try {
					const decoded = await jwt.verify(
						accessToken,
						process.env.JWT_SECRET as string
					)

					req.user = decoded
					next()
				} catch (error) {
					// Handle other errors
					if (error instanceof Error)
						res.status(401).json({
							success: false,
							message:
								error.message ||
								"Unknown error occurred during verify access token",
						})
				}
			} else {
				// No access token and no refresh token found
				res.status(401).json({
					success: false,
					message: "No access or refresh token found in cookies",
				})
			}
		} else {
			// No cookies found
			res.status(401).json({
				success: false,
				message: "No cookies found",
			})
		}
	}
)

const verifyRefreshToken = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		await verifyToken(req, res, next, "refreshToken")
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

export { verifyAccessToken, verifyRefreshToken, isAdmin }
