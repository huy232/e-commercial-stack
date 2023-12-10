import { Request, Response } from "express"
import { Blog, Coupon, ICartItem, IProduct, Order, User } from "../../models"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import mongoose, { Document } from "mongoose"

class OrderController {
	createNewOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const { coupon } = req.body
			const user = await User.findById(_id)
				.select("cart")
				.populate("cart.product", "title price")

			if (user) {
				const products = user.cart.map((cartItem: ICartItem) => ({
					product: (cartItem.product as Document)._id,
					count: cartItem.quantity,
					color: cartItem.color,
				}))
				let total = user.cart.reduce((sum, cartItem) => {
					if (cartItem.product instanceof mongoose.Document) {
						const productPrice = (cartItem.product as IProduct).price
						return productPrice * cartItem.quantity + sum
					} else {
						return sum
					}
				}, 0)

				if (coupon) {
					const selectedCoupon = await Coupon.findById(coupon)
					if (selectedCoupon) {
						total = Math.round(
							((total * (1 - Number(selectedCoupon.discount) / 100)) / 1000) *
								1000
						)
					}
				}

				const response = await Order.create({
					products,
					total,
					orderBy: _id,
					coupon,
				})
				res.json({
					success: true,
					message: "Success created user cart",
					createdOrder: response,
				})
			} else {
				res.json({
					success: false,
					message: "Something went wrong while creating user cart",
					createdOrder: {},
				})
			}
		}
	)

	updateStatusOrder = asyncHandler(async (req: Request, res: Response) => {
		const { order_id } = req.params
		const { status } = req.body

		if (!status) {
			throw new Error("Missing status update for order")
		}
		const response = await Order.findByIdAndUpdate(
			order_id,
			{ status },
			{ new: true }
		)

		res.json({
			success: response ? true : false,
			response: response ? response : {},
		})
	})

	getUserOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { _id } = req.user
			const response = await Order.find({ orderBy: _id })

			res.json({
				success: response ? true : false,
				response: response ? response : {},
			})
		}
	)

	getOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const response = await Order.find()

		res.json({
			success: response ? true : false,
			response: response ? response : {},
		})
	})
}

export default new OrderController()
