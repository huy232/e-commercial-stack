import { Request, Response } from "express"
import { Blog, User } from "../../models"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import { Types } from "mongoose"

class OrderController {
	createNewOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const userCart = await User.findById(_id).select("cart")
			const { title, description, category } = req.body
			if (!title || !description || !category) {
				throw new Error("Missing inputs required")
			}
			const response = await Blog.create(req.body)
			res.json({
				success: response ? true : false,
				message: response
					? "Success created blog"
					: "Something went wrong while created blog",
				createdOrder: response ? response : {},
			})
		}
	)
}

export default new OrderController()
