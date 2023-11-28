import User from "../models/user.model"
import asyncHandler from "express-async-handler"
import * as bcrypt from "bcrypt"
import { Request, Response } from "express"
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt"
import { AuthenticatedRequest } from "../types/user"

const register = asyncHandler(
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

		const hashedPassword = await bcrypt.hash(password, 10)

		const response = await User.create({
			...req.body,
			password: hashedPassword,
		})

		res.status(200).json({
			success: response ? true : false,
			message: response
				? "Register successfully"
				: "Something went wrong while registering",
		})
	}
)

const login = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
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
		const passwordCompareCheck = await bcrypt.compare(password, user.password)
		if (passwordCompareCheck) {
			const userData = user.toObject()
			const { password, role, ...rest } = userData
			const accessToken = generateAccessToken(userData._id, role)
			const refreshToken = generateRefreshToken(userData._id)
			// Save refresh token to database
			await User.findByIdAndUpdate(
				userData._id,
				{ refreshToken },
				{ new: true }
			)
			// Save refresh token to cookie
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})

			res.status(200).json({
				success: true,
				message: "Login successfully",
				userData: rest,
				accessToken,
				refreshToken,
			})
		} else {
			throw new Error("Invalid credentials")
		}
	}
)

const getCurrentUser = asyncHandler(
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

export default {
	register,
	login,
	getCurrentUser,
}
