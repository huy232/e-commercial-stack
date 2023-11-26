import User from "../models/user.model"
import asyncHandler from "express-async-handler"
import * as bcrypt from "bcrypt"
import { Request, Response } from "express"

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

		const hashedPassword = await bcrypt.hash(password, 10)

		const response = await User.create({
			...req.body,
			password: hashedPassword,
		})

		res.status(200).json({
			success: response ? true : false,
			response,
		})
	}
)

export default {
	register,
}
