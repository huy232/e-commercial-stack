import { Request, Response } from "express"
import {
	Blog,
	Cart,
	Coupon,
	ICartItem,
	ICoupon,
	IProduct,
	Order,
	Product,
	ProductCategory,
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
import { userCartPopulate } from "../../constant"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class OrderController {
	createCheckoutSession = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { products, couponCode, backUrl } = req.body
			let discountObject: ICoupon | null = null
			let coupon_id: string | null = null
			let productPrice
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
				if (product.variant && product.variant.variant.length > 0) {
					const variantDescription = product.variant.variant
						.map(
							(v: { type: string; value: string }) =>
								`${v.type.charAt(0).toUpperCase() + v.type.slice(1)}: ${
									v.value
								}`
						)
						.join("; ")
					productData.description = variantDescription
				}
				if (
					product.product.enableDiscount &&
					new Date(product.product.discount.expirationDate) > new Date()
				) {
					productPrice = product.product.discount.productPrice
				} else {
					productPrice = product.product.price
				}
				// Calculate unit_amount
				const unitAmount = productPrice + (product?.variant?.price || 0)

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
			// const placeholderOrder = await Order.create({
			// 	products,
			// 	total: 0,
			// 	orderBy: req.user._id,
			// })
			// const orderId = placeholderOrder._id.toString()
			const session = await stripe.checkout.sessions.create(
				{
					payment_method_types: ["card"],
					line_items: items,
					mode: "payment",
					// success_url: `${
					// 	process.env.URL_CLIENT as string
					// }/order-success?orderId=${orderId}`,
					success_url: `${process.env.URL_CLIENT as string}`,
					cancel_url: `${process.env.URL_CLIENT as string}/${backUrl}`,
					metadata: {
						userId: req.user._id,
						couponCode,
						couponId: coupon_id,
						// orderId,
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
		const { search, type, sort, order } = req.query
		const { _id } = req.user

		if (!_id) {
			res.json({
				success: false,
				data: [],
				message: "No user found to get orders",
			})
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

		const allowedSortFields: Record<string, string> = {
			status: "status",
			total: "total",
			firstName: "orderBy.firstName", // Since we populate, we can sort this directly
		}

		const sortField = allowedSortFields[sort as string] || "createdAt"
		const sortOrder = order === "asc" ? 1 : -1

		// Get total count before applying pagination
		const totalOrders = await Order.countDocuments(searchQuery)
		const totalPages = Math.ceil(totalOrders / limit)
		const hasNextPage = page < totalPages

		// Fetch orders with populated user data
		const response = await Order.find(searchQuery)
			.populate("coupon")
			.populate({
				path: "orderBy",
				select: "firstName", // Only fetch `firstName` to optimize performance
			})
			.sort({ [sortField]: sortOrder })
			.skip((page - 1) * limit)
			.limit(limit)

		res.json({
			success: true,
			data: response,
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
				case "charge.succeeded":
					const checkoutSucceeded = event.data.object
					const userId = checkoutSucceeded.metadata?.userId
					const couponId = checkoutSucceeded.metadata?.couponId

					if (userId) {
						const user = await User.findById(userId)

						if (!user) {
							res.status(404).json({
								success: false,
								message: "User not found.",
							})
							return
						}

						const populatedUserCart = await Cart.findOne({ user_id: userId })
							.populate({
								path: "items.product_id",
								model: "Product",
								select:
									"title thumbnail price allowVariants variants quantity enableDiscount discount category",
							})
							.select("items.variant_id items.product_id items.quantity")
							.lean()

						if (!populatedUserCart) {
							res.status(500).json({
								success: false,
								message: "An unexpected error occurred during population.",
							})
							return
						}

						const populatedCart = transformCartItems(populatedUserCart.items)

						const filterVariantStock = (cartItems: any[]) => {
							return cartItems.map((item) => {
								let newItem = JSON.parse(JSON.stringify(item))

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
								// products: filteredCart,
								products: filteredCart,
								status: "Processing",
								total: checkoutSucceeded.amount_total,
								coupon: couponId ? couponId : null,
								orderBy: userId,
							}
							try {
								const order = await Order.create({
									...orderData,
									visible: true,
								})
								let coupon
								try {
									const couponData = await Coupon.findById(couponId)
									coupon = couponData
								} catch (error) {
									coupon = null
								}

								const emailHtml = `
								  <div style="font-family: Arial, sans-serif; max-width: 1024px; margin: 0 auto; padding: 6px; border: 1px solid #ddd; border-radius: 8px;">
								    <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
								    <p style="text-align: center; color: #555;">Order ID: <strong>${
											order._id
										}</strong></p>
								    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
								      <thead>
								        <tr>
								          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: left;">Product</th>
								          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: center;">Quantity</th>
								          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: left;">Variant</th>
								          <th style="border-bottom: 2px solid #ddd; padding-bottom: 10px; text-align: right;">Price</th>
								        </tr>
								      </thead>
								      <tbody>
								        ${filteredCart
													.map(
														(item) => `
								          <tr>
														<td style="padding: 4px 0; border-bottom: 1px solid #eee; width: 160px">
														<table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%;">
															<tr>
																<td style="padding-right: 4px; width: 60px;">
																	<img src="${item.product.thumbnail}" alt="${item.product.title}"
																			style="width: 60px; height: 60px; object-fit: contain; border-radius: 5px; display: block;">
																</td>
																<td style="max-width: 100px; text-align: center;">
																	<span style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
																							font-size: 14px; color: #333; margin-top: 5px; line-height: 1.2;">
																		${item.product.title}
																	</span>
																</td>
															</tr>
														</table>
													</td>
								            <td style="padding: 4px 0; border-bottom: 1px solid #eee; text-align: center">${
															item.quantity
														}</td>

								            <td style="padding: 4px 0; border-bottom: 1px solid #eee; text-align: left">
															${
																item.variant
																	? item.variant.variant
																			.map(
																				(variantObject: {
																					type: string
																					value: string
																				}) => `
								                <span style="display: block; font-size: 12px; color: #555; text-transform: uppercase">${variantObject.type}: ${variantObject.value}</span>
								              `
																			)
																			.join("")
																	: "<span style='display: block; font-size: 12px; color: #555; '>None</span>"
															}

								            </td>
								            <td style="padding: 4px 0; border-bottom: 1px solid #eee; text-align: right;">${item.product.price.toLocaleString(
															"it-IT",
															{
																style: "currency",
																currency: "VND",
															}
														)}</td>
								          </tr>
								        `
													)
													.join("")}
								      </tbody>
								    </table>

								    <div style="margin-top: 20px;">
								      <p style="color: #555;">Coupon Applied: <strong>${
												coupon ? coupon.name : "None"
											}</strong></p>
								      <p style="color: #333; font-size: 18px; font-weight: bold;">Total: ${checkoutSucceeded.amount_total.toLocaleString(
												"it-IT",
												{
													style: "currency",
													currency: "VND",
												}
											)}</p>
								    </div>

								    <p style="text-align: center; color: #999; margin-top: 20px">Thank you for your purchase!</p>

										<table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="text-align: center; margin-top: 20px;">
												<tr>
												 <td align="center">
														<a href="${process.env.URL_CLIENT}/order-success?orderId=${order._id}"
														style="background-color: #F43F5E; padding: 10px 20px; color: 	#ffffff; border-radius: 8px;
								  					text-decoration: none; font-size: 16px; font-weight: 700; display: 	inline-block;">
															Check out your billing information here.
														</a>
													</td>
												</tr>
										</table>
								  </div>
								`

								const response = await sendMail({
									email: user.email,
									html: emailHtml,
									subject: "User billing information",
								})

								const io = req.app.get("io") // Access io instance from app
								io.emit("orderUpdated", {
									message: "Order updated",
									orderId: order._id,
								})
								io.emit("newestOrdersUpdated", {
									message: "Newest orders updated",
								})
							} catch (error) {
								console.log("Error while update order in checkout session")
							}
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
		await Cart.deleteOne({ user_id: userId })
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
				.populate("orderBy")
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

	// getSalesByCategory = asyncHandler(async (req, res) => {
	// 	try {
	// 		const salesByCategory = await Order.aggregate([
	// 			// Filter only visible orders
	// 			{ $match: { visible: true } },

	// 			// Deconstruct the products array
	// 			{ $unwind: "$products" },

	// 			// Extract relevant product details and category
	// 			{
	// 				$project: {
	// 					category: "$products.product.category",
	// 					quantity: "$products.quantity",
	// 				},
	// 			},

	// 			// Group by category and sum up the quantities
	// 			{
	// 				$group: {
	// 					_id: "$category",
	// 					totalSold: { $sum: "$quantity" },
	// 				},
	// 			},

	// 			// Optionally, lookup category details if needed
	// 			{
	// 				$lookup: {
	// 					from: "categories", // Replace with your category collection name
	// 					localField: "_id",
	// 					foreignField: "_id",
	// 					as: "categoryDetails",
	// 				},
	// 			},

	// 			// Simplify the output
	// 			{
	// 				$project: {
	// 					categoryId: "$_id",
	// 					totalSold: 1,
	// 					categoryDetails: { $arrayElemAt: ["$categoryDetails", 0] },
	// 				},
	// 			},
	// 		])

	// 		res.status(200).json({
	// 			success: true,
	// 			data: salesByCategory,
	// 		})
	// 	} catch (error) {
	// 		console.error("Error fetching sales by category:", error)
	// 		res.status(500).json({
	// 			success: false,
	// 			message: "Error fetching sales by category",
	// 			data: [],
	// 		})
	// 	}
	// })

	getSalesByCategory = asyncHandler(async (req, res) => {
		try {
			const salesByCategory = await ProductCategory.aggregate([
				// Lookup orders and match their categories
				{
					$lookup: {
						from: "orders", // Order collection name
						let: { categoryId: "$_id" },
						pipeline: [
							{ $match: { visible: true } }, // Match only visible orders
							{ $unwind: "$products" }, // Flatten products array
							{
								$addFields: {
									"products.product.category": {
										$convert: {
											input: "$products.product.category",
											to: "objectId",
											onError: "$products.product.category",
											onNull: null,
										},
									},
								},
							},
							{
								$match: {
									$expr: {
										$eq: ["$products.product.category", "$$categoryId"],
									},
								},
							},
							{
								$group: {
									_id: "$products.product.category",
									totalSold: { $sum: "$products.quantity" },
								},
							},
						],
						as: "orders",
					},
				},

				// Add totalSold field, default to 0 if no orders found
				{
					$addFields: {
						totalSold: {
							$ifNull: [{ $arrayElemAt: ["$orders.totalSold", 0] }, 0],
						},
					},
				},

				// Clean up the output
				{
					$project: {
						_id: 1,
						title: 1,
						totalSold: 1,
					},
				},
			])

			res.status(200).json({
				success: true,
				data: salesByCategory,
			})
		} catch (error) {
			console.error("Error fetching sales by category: ", error)
			res.status(500).json({
				success: false,
				message: "Error fetching sales by category",
				data: [],
			})
		}
	})

	getAllYearSaleOrder = asyncHandler(async (req, res) => {
		try {
			// Get current year
			const currentYear = new Date().getFullYear()

			// Start and end dates of the current year
			const startOfYear = new Date(`${currentYear}-01-01T00:00:00Z`)
			const endOfYear = new Date(`${currentYear}-12-31T23:59:59Z`)

			// Aggregate pipeline
			const yearlySales = await Order.aggregate([
				// Match orders created in the current year
				{
					$match: {
						createdAt: {
							$gte: startOfYear,
							$lte: endOfYear,
						},
					},
				},
				// Group and sum the total field
				{
					$group: {
						_id: null, // No grouping key needed; we only want the sum
						totalSales: { $sum: "$total" },
					},
				},
			])

			// Extract totalSales or default to 0 if no orders
			const totalSales = yearlySales.length > 0 ? yearlySales[0].totalSales : 0

			res.status(200).json({
				success: true,
				data: { totalSales },
			})
		} catch (error) {
			console.error("Error fetching all year sale orders:", error)
			res.status(500).json({
				success: false,
				message: "Error fetching all year sale orders",
				data: [],
			})
		}
	})
}

export default new OrderController()
