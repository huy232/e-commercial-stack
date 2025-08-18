import jwt, { JwtPayload } from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { AuthenticatedRequest } from "../types/user"
import { generateAccessToken } from "./jwt"
import { User } from "../models"

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

			const accessToken = tokenCookie ? tokenCookie.split("=")[1] : null
			const refreshToken = req.cookies.refreshToken

			let isAccessTokenExpired = true

			if (accessToken) {
				try {
					const decodedAccess = jwt.verify(
						accessToken,
						process.env.JWT_SECRET as string,
						{ ignoreExpiration: true }
					) as JwtPayload

					isAccessTokenExpired = decodedAccess.exp
						? decodedAccess.exp * 1000 < Date.now()
						: true
				} catch (error) {
					console.error("Error decoding access token:", error)
				}
			}

			// If access token is missing or expired, use the refresh token
			if (!accessToken || isAccessTokenExpired) {
				if (refreshToken) {
					try {
						const decodedRefresh = jwt.verify(
							refreshToken,
							process.env.JWT_SECRET as string
						) as JwtPayload

						const newAccessToken = generateAccessToken(
							decodedRefresh._id,
							decodedRefresh.role
						)

						// Set new access token in cookies
						res.cookie("accessToken", newAccessToken, {
							httpOnly: true,
							maxAge: 60 * 1000,
							sameSite: "none",
							secure: true,
						})

						req.user = jwt.decode(newAccessToken) as JwtPayload
						return next()
					} catch (refreshError) {
						console.error("Error during verify refresh token:", refreshError)
						res.status(401).json({
							success: false,
							message: "Both access and refresh tokens are expired",
						})
						return
					}
				} else {
					res.status(401).json({
						success: false,
						message: "No access or refresh token found in cookies",
					})
					return
				}
			}

			// Validate access token if it's still valid
			try {
				req.user = jwt.verify(
					accessToken,
					process.env.JWT_SECRET as string
				) as JwtPayload
				return next()
			} catch (error) {
				res.status(401).json({
					success: false,
					message: "Invalid access token",
				})
				return
			}
		} else {
			res.status(401).json({
				success: false,
				message: "No cookies found",
			})
			return
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
		const { _id } = req.user
		const user = await User.findById({ _id }).select("-refreshToken -password")
		if (user && user.role.includes("admin")) {
			next()
		} else {
			res.status(403).json({
				success: false,
				message: "Access denied. User is not an admin.",
			})
		}
	}
)

const optionalAccessToken = asyncHandler(
	async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		const cookiesHeader = req.headers.cookie
		if (!cookiesHeader) return next()

		const cookieArray = cookiesHeader.split("; ").map((cookie) => cookie.trim())
		const accessToken = cookieArray
			.find((c) => c.startsWith("accessToken="))
			?.split("=")[1]
		const refreshToken = cookieArray
			.find((c) => c.startsWith("refreshToken="))
			?.split("=")[1]

		let decodedAccess: JwtPayload | null = null

		if (accessToken) {
			try {
				// Try verifying accessToken (valid and unexpired)
				decodedAccess = jwt.verify(
					accessToken,
					process.env.JWT_SECRET as string
				) as JwtPayload
				req.user = decodedAccess
				return next()
			} catch (err) {
				// Ignore, we'll try refresh token below
			}
		}

		// If accessToken missing or expired — check refreshToken
		if (refreshToken) {
			try {
				const decodedRefresh = jwt.verify(
					refreshToken,
					process.env.JWT_SECRET as string
				) as JwtPayload

				const newAccessToken = generateAccessToken(
					decodedRefresh._id,
					decodedRefresh.role
				)

				// Attach new access token as cookie (valid for 1 minute)
				res.cookie("accessToken", newAccessToken, {
					httpOnly: true,
					maxAge: 60 * 1000,
					sameSite: "none",
					secure: true,
				})

				req.user = jwt.decode(newAccessToken) as JwtPayload
			} catch (refreshErr) {
				// Token expired or invalid — no user
			}
		}

		// Always call next, even if req.user is undefined
		return next()
	}
)

export { verifyAccessToken, verifyRefreshToken, isAdmin, optionalAccessToken }
