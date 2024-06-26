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
import * as Validators from "../../validators/userValidators"
import { validationResult } from "express-validator"
import { parseInteger } from "../../utils/parseInteger"
import { UploadedFiles } from "../../types/uploadFile"

class UserController {
	register = async (req: Request, res: Response): Promise<void> => {
		try {
			await Promise.all(
				Validators.validateRegisterUser.map((validation) => validation.run(req))
			)

			const validationErrors = validationResult(req)

			if (!validationErrors.isEmpty()) {
				res.status(400).json({ errors: validationErrors.array() })
				return
			}

			let { firstName, lastName, email, password } = req.body

			if (!firstName || !lastName || !email || !password) {
				res.status(400).json({
					success: false,
					message: "Missing inputs",
				})
				return
			}

			const user = await User.findOne({ email })

			if (user) {
				res.status(400).json({
					success: false,
					message: "User already exists",
				})
				return
			}

			const newUser = new User({
				...req.body,
			})

			const token = jwt.sign(
				{
					...req.body,
				},
				process.env.JWT_SECRET as string,
				{
					expiresIn: "15m",
				}
			)

			const registrationUrl = `${
				process.env.URL_CLIENT
			}/complete-registration?token=${encodeURIComponent(token)}`

			const emailHtml = `
        <p>Click the following link to complete your registration:</p>
        <a href="${registrationUrl}">${registrationUrl}</a>
      `

			try {
				await sendMail({
					email: newUser.email,
					html: emailHtml,
					subject: "Verify account",
				})

				res.status(200).json({
					success: true,
					message: "Registration email sent successfully. Check your inbox.",
				})

				return
			} catch (err) {
				res.status(500).json({
					success: false,
					message: "Something went wrong with verify email.",
				})

				return
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Unexpected error during validation.",
			})

			return
		}
	}

	verifyRegister = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { token } = req.query
			if (!token) {
				res.status(400).json({
					success: false,
					message: "Token is missing in the request.",
				})
				return
			}

			try {
				const decodedToken = jwt.verify(
					token as string,
					process.env.JWT_SECRET as string
				)
				const userData = decodedToken as Record<string, any>
				const { firstName, lastName, email, password } = userData
				const createdUser = await User.create({
					firstName,
					lastName,
					email,
					password,
				})

				const accessToken = generateAccessToken(
					createdUser._id,
					createdUser.role
				)
				const newRefreshToken = generateRefreshToken(createdUser._id)

				// Save refresh token to database
				await User.findByIdAndUpdate(
					createdUser._id,
					{ refreshToken: newRefreshToken },
					{ new: true }
				)

				// Set refresh token cookie
				res.cookie("refreshToken", newRefreshToken, {
					httpOnly: true,
					maxAge: 7 * 24 * 60 * 60 * 1000,
					sameSite: "none",
					secure: true,
				})

				// Set access token cookie
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					maxAge: 60 * 1000,
					sameSite: "none",
					secure: true,
				})

				res.status(200).json({
					success: true,
					message: "User created successfully.",
				})
			} catch (error) {
				res.status(400).json({
					success: false,
					message: "Invalid or expired token.",
				})
			}
		}
	)

	checkAdmin = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			console.log("Admin check: ", req.user)
			res.status(200).json({ success: true, message: "Valid role" })
		}
	)

	login = async (req: Request, res: Response): Promise<void> => {
		try {
			Validators.validateLogin.forEach((validation) => validation.run(req))
			Validators.runValidation(req, res, async () => {
				let { email, password } = req.body

				const user = await User.findOne({ email })

				if (!user) {
					res.status(400).json({
						success: false,
						message: "User does not exist",
					})
					return
				}

				const passwordCheck = await user.isCorrectPassword(password)

				if (passwordCheck) {
					const userData = user.toObject()
					const { password, refreshToken, ...rest } = userData
					const accessToken = generateAccessToken(userData._id, userData.role)
					const newRefreshToken = generateRefreshToken(userData._id)

					await User.findByIdAndUpdate(
						userData._id,
						{ refreshToken: newRefreshToken },
						{ new: true }
					)

					res.cookie("refreshToken", newRefreshToken, {
						httpOnly: true,
						maxAge: 7 * 24 * 60 * 60 * 1000,
						sameSite: "none",
						secure: true,
					})

					res.cookie("accessToken", accessToken, {
						httpOnly: true,
						maxAge: 60 * 1000,
						sameSite: "none",
						secure: true,
					})

					res.status(200).json({
						success: true,
						message: "Login successfully",
						userData: { ...rest },
						accessToken,
					})
				} else {
					res.status(400).json({
						success: false,
						message: "Invalid credentials",
					})
				}
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Unexpected error during login.",
			})
		}
	}

	getCurrentUser = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const user = await User.findById({ _id })
				.select("-refreshToken -password")
				.populate({
					path: "cart",
					populate: {
						path: "product",
						select: "title thumbnail price quantity",
					},
				})
			if (user) {
				res.status(200).json({
					success: true,
					data: user,
				})
			} else {
				res.status(404).json({
					success: false,
					data: "User not found",
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
			res.clearCookie("accessToken", { httpOnly: true, secure: true })
			res.status(200).json({
				success: true,
				message: "Successfully logout",
			})
		}
	)

	forgotPassword = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				const { email } = req.body
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
			href=${process.env.URL_CLIENT}/reset-password?token=${encodeURIComponent(
					resetToken
				)}
			>Quên mật khẩu</a>`

				const data = {
					email: email as string,
					html,
					subject: "Forgot password",
				}
				await sendMail(data)
				res.status(200).json({
					success: true,
					message: "Verify your password resetting in the mail.",
				})
			} catch (err) {
				if (err instanceof Error) {
					res.status(401).json({
						success: false,
						message:
							err.message ||
							"Something went wrong while trying to resetting the password. Try again!",
					})
				} else {
					res.status(401).json({
						success: false,
						message:
							"Something went wrong while trying to resetting the password. Try again!",
					})
				}
			}
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
			const queries = { ...req.query }
			const excludeFields = ["limit", "sort", "page", "fields"]
			excludeFields.forEach((element) => delete queries[element])

			let queryString = JSON.stringify(queries)
			queryString = queryString.replace(
				/\b(gte|gt|lt|lte)\b/g,
				(matchedElement) => `$${matchedElement}`
			)
			const formattedQueries = JSON.parse(queryString)

			// Filtering
			if (queries.name) {
				formattedQueries.name = { $regex: queries.name, $options: "i" }
			}
			if (req.query.search as string) {
				delete formattedQueries.search
				formattedQueries["$or"] = [
					{ firstName: { $regex: req.query.search, $options: "i" } },
					{ lastName: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				]
			}

			let query = User.find(formattedQueries)
			// Sorting
			if (req.query.sort as string) {
				const sortBy = (req.query.sort as string).split(",").join(" ")
				query = query.sort(sortBy)
			}

			// Fields limiting
			if (req.query.fields as string) {
				const fields = (req.query.fields as string).split(",").join(" ")
				query = query.select(fields)
			}

			const page = parseInteger(req.query.page, 1)
			const limit = parseInteger(req.query.limit, 10)
			if (page < 1) {
				res.status(400).json({
					success: false,
					message:
						"Invalid value for page parameter. Must be a positive integer.",
				})
				return
			}

			if (limit < 1) {
				res.status(400).json({
					success: false,
					message:
						"Invalid value for limit parameter. Must be a positive integer.",
				})
				return
			}
			const skip = (page - 1) * limit
			query.skip(skip).limit(limit)

			const response = await query.exec()
			// Count the documents
			const counts = await User.countDocuments(formattedQueries)
			const totalPage = Math.ceil(counts / limit) || 1
			const currentPage = page

			// const response = await User.find().select("-password -refreshToken")
			res.status(200).json({
				success: response ? true : false,
				users: response,
				counts,
				totalPage,
				currentPage,
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
			const images = req.files as UploadedFiles
			if (!_id) {
				throw new Error("User ID is missing")
			}
			let updateData = {}

			// Check if request body contains data
			if (Object.keys(req.body).length > 0) {
				updateData = { ...updateData, ...req.body }
			}
			// Check if request files contain avatar image
			if (images && images.avatar) {
				updateData = { ...updateData, avatar: images.avatar[0].path }
			}
			if (Object.keys(updateData).length === 0) {
				throw new Error("No data to update")
			}
			const response = await User.findByIdAndUpdate(_id, updateData, {
				new: true,
			}).select("-password -refreshToken")
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
			const { _id } = req.body
			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs to update user")
			}
			const response = await User.findByIdAndUpdate(_id, req.body, {
				new: true,
			}).select("-password -refreshToken")
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

	updateUserAddress = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			if (!req.body.address) {
				throw new Error("Missing inputs to update user address")
			}
			const response = await User.findByIdAndUpdate(
				_id,
				{ $push: { address: req.body.address } },
				{
					new: true,
				}
			).select("-password -refreshToken")
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

	updateUserCart = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const { product_id, quantity = 1, color } = req.body

			if (!product_id || !color) {
				throw new Error("Missing inputs for updating user cart")
			}

			try {
				const user = await User.findById(_id).select("cart")

				if (!user) {
					res.status(404).json({ success: false, message: "User not found" })
					return
				}

				let updatedUserCart

				// Check if the product already exists in the cart with the same color
				const existingProductIndex = user.cart.findIndex(
					(element) =>
						element.product?.toString() === product_id &&
						element.color === color
				)

				if (existingProductIndex !== -1) {
					// Update the quantity of the existing product
					updatedUserCart = user.cart.map((cartItem, index) =>
						index === existingProductIndex
							? { ...cartItem, quantity }
							: cartItem
					)
				} else {
					// Add a new product to the cart
					updatedUserCart = [
						...user.cart,
						{ product: product_id, quantity, color },
					]
				}

				// Update the user document with the modified cart
				const updatedUser = await User.findByIdAndUpdate(
					_id,
					{ cart: updatedUserCart },
					{ new: true }
				)

				// Modify the structure of cart before sending the response
				const updatedUserCartResponse = updatedUser?.cart.map(
					(cartItem: any) => ({
						product: cartItem.product,
						quantity: cartItem.quantity,
						color: cartItem.color,
						_id: cartItem._id,
					})
				)

				res.status(200).json({
					success: true,
					message: "User cart updated",
					cart: updatedUserCartResponse,
				})
			} catch (error) {
				console.error("Error updating user cart:", error)
				res.status(500).json({
					success: false,
					message: "An unexpected error occurred.",
				})
			}
		}
	)

	verifyAccessToken = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			res.status(200).json({ success: true, message: "Refresh token is valid" })
		}
	)

	verifyRefreshToken = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			res.status(200).json({ success: true, message: "Access token is valid" })
		}
	)

	checkAuth = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			console.log("Auth check: ", req.user)
			res.status(200).json({ success: true, message: "Valid user" })
		}
	)
}

export default new UserController()
