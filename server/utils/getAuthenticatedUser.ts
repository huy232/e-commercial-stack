import jwt, { JwtPayload } from "jsonwebtoken"
import { Response, Request } from "express"
import { generateAccessToken } from "../middlewares/jwt"

export const getAuthenticatedUser = async (
	req: Request,
	res: Response
): Promise<{ userId: string | null; accessToken?: string }> => {
	const cookies = req.headers.cookie
	if (!cookies) return { userId: null }

	const tokenCookie = cookies
		.split("; ")
		.find((cookie) => cookie.startsWith("accessToken="))
	const refreshTokenCookie = cookies
		.split("; ")
		.find((cookie) => cookie.startsWith("refreshToken="))

	let accessToken = tokenCookie ? tokenCookie.split("=")[1] : null
	const refreshToken = refreshTokenCookie
		? refreshTokenCookie.split("=")[1]
		: null

	if (accessToken) {
		try {
			const decoded = jwt.verify(
				accessToken,
				process.env.JWT_SECRET as string
			) as JwtPayload
			return { userId: decoded._id, accessToken }
		} catch (error) {
			if (error instanceof Error && error.name === "TokenExpiredError") {
				console.warn("Access token expired.")
			} else {
				console.error("Invalid access token:", error)
				return { userId: null }
			}
		}
	}

	// If accessToken is missing or expired, check refreshToken
	if (refreshToken) {
		console.warn("Attempting to refresh access token...")

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
				sameSite: "none",
				secure: true,
				maxAge: 15 * 60 * 1000, // 15 minutes
			})

			return { userId: decodedRefresh._id, accessToken: newAccessToken }
		} catch (refreshError) {
			console.error("Error refreshing token:", refreshError)
		}
	}

	// If no valid accessToken or refreshToken, return guest user
	return { userId: null }
}
