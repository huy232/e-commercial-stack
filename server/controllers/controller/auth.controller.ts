import { Request, Response } from "express"
import { User } from "../../models"
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../middlewares/jwt"

class AuthController {
	socialLogin = async (req: Request, res: Response) => {
		try {
			const { googleId, email, firstName, lastName } = req.body

			// Find or create the user
			let user = await User.findOne({ email })

			if (!user) {
				console.log("User not found, creating new user...")
				user = new User({
					email,
					firstName,
					lastName,
					socialProvider: "google",
					googleId,
				})
				await user.save()
			}
			if (user.socialProvider !== "google") {
				return res.status(400).json({
					success: false,
					message: "Email already registered with another provider",
				})
			}

			// Generate tokens
			const accessToken = generateAccessToken(user._id, user.role)
			const refreshToken = generateRefreshToken(user._id)

			// Set cookies
			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				maxAge: 60 * 1000,
				sameSite: "none",
				secure: true,
			})
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
				sameSite: "none",
				secure: true,
			})

			res.json({ success: true, user })
		} catch (error) {
			console.error("Google Login Error:", error)
			res.status(500).json({
				success: false,
				message: "Authentication failed",
				error,
			})
		}
	}
}

export default new AuthController()
