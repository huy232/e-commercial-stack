import { Request, Response } from "express"
import {
	Blog,
	Coupon,
	ICartItem,
	ICoupon,
	IProduct,
	Order,
	Product,
	User,
} from "../../models"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import mongoose, { Document } from "mongoose"
import { UserCart } from "../../types/userCart"
import { capitalizeFirstLetter } from "../../utils/capitalizeString"
import Stripe from "stripe"
import { transformCartItems } from "../../utils/cartUtils"
import { parseInteger } from "../../utils/parseInteger"
import { CheckoutItem } from "../../types/checkoutItem"
import { sendMail } from "../../utils/sendMail"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class OrderController {
	createCheckoutSession = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { products, couponCode, backUrl } = req.body
			console.log("Create checkout session")
			const placeholderOrder = await Order.create({
				products,
				total: 0,
				orderBy: req.user._id,
			})
			const orderId = placeholderOrder._id.toString()
			let discountObject: ICoupon | null = null
			let coupon_id: string | null = null
			if (couponCode) {
				const couponDoc = await Coupon.findOne({ code: couponCode })
				if (couponDoc) {
					discountObject = couponDoc as ICoupon
					coupon_id = couponDoc._id.toString()
				}
			}

			// Create items with discount applied if needed
			const items = products.map((product: UserCart) => {
				// Define productData
				const productData: {
					name: string
					images: string[]
					description?: string
				} = {
					name: product.product.title,
					images: [product.product.thumbnail],
				}

				// Calculate unit_amount
				const unitAmount =
					product.product.price + (product?.variant?.price || 0)

				let discountedUnitAmount = unitAmount

				if (discountObject) {
					if (discountObject.discountType === "fixed") {
						// Fixed discount
						discountedUnitAmount = Math.max(
							unitAmount - discountObject.discount,
							0
						)
					} else if (discountObject.discountType === "percentage") {
						// Percentage discount
						discountedUnitAmount = Math.max(
							unitAmount - (unitAmount * discountObject.discount) / 100,
							0
						)
					}
				}

				// Round to ensure unit_amount is an integer
				const roundedDiscountedUnitAmount = Math.round(discountedUnitAmount)

				return {
					price_data: {
						currency: "vnd",
						product_data: productData,
						unit_amount: roundedDiscountedUnitAmount,
					},
					quantity: product.quantity,
				}
			})

			// Create the Stripe checkout session
			const session = await stripe.checkout.sessions.create(
				{
					payment_method_types: ["card"],
					line_items: items,
					mode: "payment",
					success_url: `${
						process.env.URL_CLIENT as string
					}/order-success?orderId=${orderId}`,
					cancel_url: `${process.env.URL_CLIENT as string}/${backUrl}`,
					metadata: {
						userId: req.user._id,
						couponCode,
						couponId: coupon_id,
						orderId,
					},
				},
				{ apiKey: process.env.STRIPE_SECRET_KEY }
			)

			res.json({ id: session.id })
		}
	)

	createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
		const { amount, currency } = req.body

		try {
			const paymentIntent = await stripe.paymentIntents.create(
				{
					amount,
					currency,
					automatic_payment_methods: {
						enabled: true,
					},
				},
				{ apiKey: process.env.STRIPE_SECRET_KEY }
			)

			res.status(200).json({ clientSecret: paymentIntent.client_secret })
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error creating payment intent:", error.message)
				res.status(500).json({ success: false, message: error.message })
			} else {
				console.error("Unknown error:", error)
				res
					.status(500)
					.json({ success: false, message: "An unknown error occurred" })
			}
		}
	})
	createNewOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const {
				phoneNumber,
				country,
				province,
				district,
				ward,
				fullName,
				address,
				email,
				notes,
				couponCode,
				payment_method_id,
				cart,
			} = req.body

			console.log(req.body)

			try {
				const customer = await stripe.customers.create(
					{
						email: email,
						phone: phoneNumber,
						name: fullName,
						address: {
							line1: address,
							city: district,
							state: province,
							postal_code: ward,
							country: country,
						},
					},
					{ apiKey: process.env.STRIPE_SECRET_KEY }
				)

				const paymentIntent = await stripe.paymentIntents.create(
					{
						amount: 1000, // Replace with the actual amount
						currency: "usd",
						customer: customer.id,
						payment_method: payment_method_id,
						confirm: true,
						metadata: {
							userId: req.user._id,
						},
						automatic_payment_methods: {
							enabled: true,
						},
					},
					{ apiKey: process.env.STRIPE_SECRET_KEY }
				)

				if (
					paymentIntent.status === "requires_action" &&
					paymentIntent.next_action.type === "use_stripe_sdk"
				) {
					res.status(200).json({
						requires_action: true,
						payment_intent_client_secret: paymentIntent.client_secret,
					})
				} else if (paymentIntent.status === "succeeded") {
					const bill = {
						customer_id: customer.id,
						amount: paymentIntent.amount,
						currency: paymentIntent.currency,
						status: paymentIntent.status,
						created: paymentIntent.created,
						cart: cart,
						notes: notes,
					}

					// Respond with the bill details
					res.status(200).json({ bill })
				} else {
					res.status(500).json({ success: false, message: "Unexpected status" })
				}
			} catch (error) {
				// Type assertion for error
				if (error instanceof Error) {
					console.error("Error creating payment intent:", error.message)
					res.status(500).json({ success: false, message: error.message })
				} else {
					console.error("Unknown error:", error)
					res
						.status(500)
						.json({ success: false, message: "An unknown error occurred" })
				}
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
			data: response ? response : {},
		})
	})

	getUserOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { _id } = req.user
			if (!_id) {
				res.json({
					success: false,
					data: [],
					message: "No user found to get orders",
				})
				return
			}

			const page = parseInteger(req.query.page, 1)
			const limit = parseInteger(req.query.limit, 10)
			const totalOrders = await Order.countDocuments({ orderBy: _id })
			const totalPages = Math.ceil(totalOrders / limit)
			const hasNextPage = page < totalPages

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

			const query = Order.find({ orderBy: _id })
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate("coupon")

			const response = await query.exec()

			res.json({
				success: response ? true : false,
				data: response ? response : [],
				currentPage: page,
				totalPages: totalPages,
				totalItems: totalOrders,
				hasNextPage: hasNextPage,
			})
		}
	)

	getOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { search, type } = req.query
		const { _id } = req.user
		if (!_id) {
			res.json({
				success: false,
				data: [],
				message: "No user found to get orders",
			})
			return
		}
		const page = parseInteger(req.query.page, 1)
		const limit = parseInteger(req.query.limit, 10)
		let searchQuery = {}
		if (search && type) {
			if (type === "order_id") {
				searchQuery = { _id: search }
			} else if (type === "user_id") {
				searchQuery = { orderBy: search }
			}
		}

		const totalOrders = await Order.countDocuments()
		const totalPages = Math.ceil(totalOrders / limit)
		const hasNextPage = page < totalPages

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

		const query = Order.find(searchQuery)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("coupon")
			.populate("orderBy")

		const response = await query.exec()

		res.json({
			success: response ? true : false,
			data: response ? response : [],
			currentPage: page,
			totalPages: totalPages,
			totalItems: totalOrders,
			hasNextPage: hasNextPage,
		})
	})

	handleWebhook = async (req: Request, res: Response) => {
		try {
			const sig = req.headers["stripe-signature"] as string
			let event

			try {
				event = stripe.webhooks.constructEvent(
					req.body,
					sig,
					process.env.STRIPE_WEBHOOK_SECRET as string
				)
			} catch (err) {
				console.error(
					`Webhook Error: ${
						err instanceof Error ? err.message : "Unknown error"
					}`
				)
				res
					.status(400)
					.send(
						`Webhook Error: ${
							err instanceof Error ? err.message : "Unknown error"
						}`
					)
				return
			}
			switch (event.type) {
				case "payment_intent.succeeded":
					break
				case "payment_intent.created":
					break
				case "checkout.session.completed":
					const checkoutSucceeded = event.data.object
					const userId = checkoutSucceeded.metadata?.userId
					const couponId = checkoutSucceeded.metadata?.couponId
					const orderId = checkoutSucceeded.metadata?.orderId
					if (userId && orderId) {
						const populatedUserCart = await User.findById(userId)
							.populate({
								path: "cart.product_id",
								select: "title thumbnail price allowVariants variants quantity",
							})
							.exec()
						if (!populatedUserCart) {
							res.status(500).json({
								success: false,
								message: "An unexpected error occurred during population.",
							})
							return
						}

						// Map the populated cart to the expected ICartItemPopulate type
						if (!populatedUserCart || !populatedUserCart.cart) {
							console.error("User or cart not found")
							res.status(404).send("User or cart not found")
						}
						const populatedCart = transformCartItems(populatedUserCart.cart)
						const filterVariantStock = (cartItems: any[]) => {
							return cartItems.map((item) => {
								let newItem = { ...item }

								if (newItem.variant) {
									const { stock, ...filteredVariant } = newItem.variant
									newItem = { ...newItem, variant: filteredVariant }
								}

								if (newItem.product) {
									const { quantity, ...filteredProduct } = newItem.product
									newItem = { ...newItem, product: filteredProduct }
								}

								return newItem
							})
						}
						const filteredCart = filterVariantStock(populatedCart)
						if (populatedUserCart) {
							const orderData = {
								products: filteredCart,
								status: "Processing",
								total: checkoutSucceeded.amount_total,
								coupon: couponId ? couponId : null,
								orderBy: populatedUserCart._id,
							}

							try {
								await Order.findByIdAndUpdate(
									orderId,
									{ ...orderData, visible: true },
									{ new: true }
								)
							} catch (error) {
								console.log("Error while update order in checkout session")
							}
							const emailHtml = `
							  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
							    <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
							    <p style="text-align: center; color: #555;">Order ID: <strong>${orderId}</strong></p>

							    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
							      <thead>
							        <tr>
							          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: left;">Product</th>
							          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: left;">Quantity</th>
							          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: left;">Variant</th>
							          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: right;">Price</th>
							        </tr>
							      </thead>
							      <tbody>
							        ${filteredCart
												.map(
													(item) => `
							          <tr>
							            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
							              <div style="display: flex; align-items: center;">
							                <img src="${item.product.thumbnail}" alt="${
														item.product.title
													}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 5px;" />
							                <span>${item.product.title}</span>
							              </div>
							            </td>
							            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${
														item.quantity
													}</td>
							            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
							              ${
															item.variant
																? Object.entries(item.variant)
																		.map(
																			([key, value]) => `
							                <span style="display: block; font-size: 12px; color: #555;">${key}: ${value}</span>
							              `
																		)
																		.join("")
																: "None"
														}
							            </td>
							            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${
														item.product.price
													} VND</td>
							          </tr>
							        `
												)
												.join("")}
							      </tbody>
							    </table>

							    <div style="margin-top: 20px;">
							      <p style="color: #555;">Coupon Applied: <strong>${
											couponId ? couponId : "None"
										}</strong></p>
							      <p style="color: #333; font-size: 18px; font-weight: bold;">Total: ${
											checkoutSucceeded.amount_total
										} VND</p>
							    </div>

							    <p style="text-align: center; color: #999; margin-top: 20px;">Thank you for your purchase!</p>
							  </div>
							`

							await sendMail({
								email: populatedUserCart.email,
								html: emailHtml,
								subject: "User billing information",
							})
							// After successfully updating the order, emit a socket event

							const io = req.app.get("io") // Access io instance from app
							io.emit("orderUpdated", { message: "Order updated", orderId })
							io.emit("newestOrdersUpdated", {
								message: "Newest orders updated",
							})
						}
						await this.updateProductAndVariantQuantities(populatedCart)
						await this.clearCartForUser(userId)
					}
					break
				default:
					console.log(`Unhandled event type ${event.type}`)
			}
			res.status(200).send()
		} catch (error) {
			console.log("Something wrong with webhook")
			console.log(error)
			res.status(500).send()
		}
	}

	clearCartForUser = async (userId: string) => {
		await User.findByIdAndUpdate(userId, { cart: [] })
	}
	updateProductAndVariantQuantities = async (cartItems: any[]) => {
		for (const item of cartItems) {
			const product = await Product.findById(item.product._id)
			if (product) {
				if (product.allowVariants && item.variant && product.variants) {
					const variant = product.variants.find(
						(v) => v._id.toString() === item.variant._id.toString()
					)
					if (variant) {
						variant.stock = variant.stock - item.quantity
					}
					// Recalculate the product quantity by summing up all variant stocks
					product.quantity = product.variants.reduce(
						(total, v) => total + v.stock,
						0
					)
					// Mark the variants array as modified
					product.markModified("variants")
				} else {
					// If no variants, just update the product quantity
					product.quantity = product.quantity - item.quantity
				}
				await product.save()
			}
		}
	}

	updateOrders = async (req: Request, res: Response) => {
		try {
			const modifiedOrders = req.body
			if (!modifiedOrders) {
				return res.status(400).json({ message: "Invalid request body" })
			}

			console.log(modifiedOrders)

			// Cast Object.entries to ensure TypeScript knows that status is a string
			const modifiedOrdersArray = Object.entries(modifiedOrders).map(
				([_id, status]) => ({ _id, status: status as string })
			)

			const bulkOps = modifiedOrdersArray.map(
				(order: { _id: string; status: string }) => {
					return {
						updateOne: {
							filter: { _id: order._id },
							update: { status: order.status },
						},
					}
				}
			)

			console.log(bulkOps)

			await Order.bulkWrite(bulkOps)

			res.status(200).json({ message: "Orders updated successfully" })
		} catch (error) {
			console.error("Error updating orders:", error)
			res.status(500).json({ message: "Failed to update orders" })
		}
	}

	getSpecificOrder = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { orderId } = req.query
			const { _id } = req.user
			if (!_id) {
				res.json({
					success: false,
					data: [],
					message: "No user found to get orders",
				})
				return
			}

			const query = Order.findOne({ _id: orderId })
				.populate("coupon")
				.populate("orderBy")
			const response = await query.exec()
			res.status(200).json({ message: "Get specific order", data: response })
		}
	)

	getOrdersByMonth = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { _id } = req.user
			if (!_id) {
				res.json({
					success: false,
					data: [],
					message: "No user found to proceed this request",
				})
				return
			}
			const ordersByMonth = await Order.aggregate([
				{
					$group: {
						_id: { $month: "$createdAt" }, // Group by month
						count: { $sum: 1 }, // Count the number of orders
					},
				},
				{
					$sort: { _id: 1 }, // Sort by month (1 = January, 12 = December)
				},
			])

			// Ensure that all 12 months are accounted for, even if no orders exist for some months
			const fullYearData = Array.from({ length: 12 }, (_, i) => {
				const month = i + 1 // Month numbers 1 through 12
				const orderData = ordersByMonth.find((order) => order._id === month)
				return { month, count: orderData ? orderData.count : 0 }
			})

			res.json({
				success: true,
				data: fullYearData, // Send the full 12 months with count data
			})
		}
	)
	getTotalOrderSumsByMonth = asyncHandler(
		async (req: Request, res: Response) => {
			try {
				const totalSumsByMonth = await Order.aggregate([
					{
						// Extract the year and month from the order date
						$group: {
							_id: {
								year: { $year: "$createdAt" },
								month: { $month: "$createdAt" },
							},
							totalAmount: { $sum: "$total" },
						},
					},
					{
						// Optionally sort the results by year and month
						$sort: {
							"_id.year": 1,
							"_id.month": 1,
						},
					},
				])

				res.json({
					success: true,
					data: totalSumsByMonth,
				})
			} catch (error) {
				res.status(500).json({
					success: false,
					message: "Error calculating total sums by month",
					data: [],
				})
			}
		}
	)

	getNewestOrders = asyncHandler(async (req: Request, res: Response) => {
		try {
			// Find the 5 newest orders
			const newestOrders = await Order.find({ visible: true })
				.sort({ createdAt: -1 }) // Sort by createdAt in descending order
				.limit(5) // Limit to 5 orders
				.populate("orderBy", "_id firstName lastName email avatar")
				.populate("coupon")

			res.json({
				success: true,
				data: newestOrders,
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching newest orders",
				data: [],
			})
		}
	})
}

export default new OrderController()
