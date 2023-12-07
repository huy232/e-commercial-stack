import { User } from "../../models"
import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../middlewares/jwt"
import { AuthenticatedRequest } from "../../types/user"
import jwt, { JwtPayload } from "jsonwebtoken"
import { sendMail } from "../../utils/sendMail"
import crypto from "crypto"

class UserController {
	register = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			let { firstName, lastName, email, password, mobile } = req.body

			if (!firstName || !lastName || !email || !password || !mobile) {
				res.status(400).json({
					success: false,
					message: "Missing inputs",
				})
				return
			}

			const user = await User.findOne({ email })
			if (user) {
				throw new Error("User has existed")
			}

			const response = await User.create({
				...req.body,
			})

			res.status(200).json({
				success: response ? true : false,
				message: response
					? "Register successfully"
					: "Something went wrong while registering",
			})
		}
	)

	login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		let { email, password } = req.body

		if (!email || !password) {
			res.status(400).json({
				success: false,
				message: "Missing inputs",
			})
			return
		}

		const user = await User.findOne({ email })
		if (!user) {
			throw new Error("User does not exist")
		}

		const passwordCheck = await user.isCorrectPassword(password)

		if (passwordCheck) {
			const userData = user.toObject()
			const { password, role, refreshToken, ...rest } = userData
			const accessToken = generateAccessToken(userData._id, role)
			const newRefreshToken = generateRefreshToken(userData._id)
			// Save refresh token to database
			await User.findByIdAndUpdate(
				userData._id,
				{ refreshToken: newRefreshToken },
				{ new: true }
			)
			// Save refresh token to cookie
			res.cookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})

			res.status(200).json({
				success: true,
				message: "Login successfully",
				userData: { ...rest },
				accessToken,
			})
		} else {
			throw new Error("Invalid credentials")
		}
	})

	getCurrentUser = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const user = await User.findById({ _id }).select(
				"-refreshToken -password -role"
			)
			if (user) {
				res.status(200).json({
					success: true,
					response: user,
				})
			} else {
				res.status(404).json({
					success: false,
					response: "User not found",
				})
			}
		}
	)

	refreshAccessToken = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const cookies = req.cookies
			if (!cookies && !cookies.refreshToken) {
				throw new Error("No refresh token in cookies")
			}

			const responseToken = await jwt.verify(
				cookies.refreshToken,
				process.env.JWT_SECRET as string
			)
			const jwtPayload = responseToken as JwtPayload
			const response = await User.findById({
				_id: jwtPayload._id,
				refreshToken: cookies.refreshToken,
			})
			res.status(200).json({
				success: response ? true : false,
				newAccessToken: response
					? generateAccessToken(response._id, response.role)
					: "Refresh token not matched",
			})
		}
	)

	logout = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const cookies = req.cookies
			if (!cookies && !cookies.refreshToken) {
				throw new Error("No refresh token in cookies")
			}

			await User.findOneAndUpdate(
				{ refreshToken: cookies.refreshToken },
				{ refreshToken: "" },
				{ new: true }
			)

			res.clearCookie("refreshToken", { httpOnly: true, secure: true })
			res.status(200).json({
				success: true,
				message: "Successfully logout",
			})
		}
	)

	forgotPassword = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { email } = req.query
			if (!email) {
				throw new Error("Missing email")
			}
			const user = await User.findOne({ email })
			if (!user) {
				throw new Error("User not found")
			}
			const resetToken = user.createPasswordChangedToken()
			await user.save()

			const html = `Xin vui lòng nhấn vào đường dẫn bên dưới để thay đổi mật khẩu. Đường dẫn có hiệu lực từ lúc nhận tin nhắn cho đến 15 phút sau. 
			<a 
			href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}
			>Quên mật khẩu</a>`

			const data = {
				email: email as string,
				html,
			}
			const response = await sendMail(data)
			res.status(200).json({
				success: true,
				response,
			})
		}
	)

	resetPassword = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { password, token } = req.body
			if (!password || !token) {
				throw new Error("Missing inputs")
			}
			const passwordResetToken = crypto
				.createHash("sha256")
				.update(token)
				.digest("hex")
			const user = await User.findOne({
				passwordResetToken,
				passwordResetExpired: { $gt: Date.now() },
			})
			if (!user) {
				throw new Error("Invalid reset token")
			}
			user.password = password
			user.passwordResetToken = undefined
			user.passwordResetExpired = undefined
			user.passwordChangedAt = Date.now().toString()
			await user.save()
			res.status(200).json({
				success: user ? true : false,
				message: user
					? "Updated password"
					: "Something went wrong while reset password",
			})
		}
	)

	getAllUsers = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await User.find().select("-password -refreshToken -role")
			res.status(200).json({
				success: response ? true : false,
				users: response,
			})
		}
	)

	deleteUser = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { _id } = req.query
			if (!_id) {
				throw new Error("Missing inputs to delete user")
			}
			const response = await User.findByIdAndDelete(_id)
			if (response) {
				res.status(200).json({
					success: true,
					message: `Deleted user: ${response.email}`,
				})
			} else {
				res.status(404).json({
					success: false,
					message: `Something went wrong while deleting user`,
				})
			}
		}
	)

	updateUser = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			if (!_id || Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs to update user")
			}
			const response = await User.findByIdAndUpdate(_id, req.body, {
				new: true,
			}).select("-password -role -refreshToken")
			if (response) {
				res.status(200).json({
					success: true,
					response,
					message: "Successfully update",
				})
			} else {
				res.status(404).json({
					success: false,
					message: `Something went wrong while user tried to update`,
				})
			}
		}
	)

	updateUserByAdmin = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { uid } = req.user
			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs to update user")
			}
			const response = await User.findByIdAndUpdate(uid, req.body, {
				new: true,
			}).select("-password -role -refreshToken")
			if (response) {
				res.status(200).json({
					success: true,
					response,
					message: "Successfully update",
				})
			} else {
				res.status(404).json({
					success: false,
					message: `Something went wrong while user tried to update`,
				})
			}
		}
	)
}

export default new UserController()
