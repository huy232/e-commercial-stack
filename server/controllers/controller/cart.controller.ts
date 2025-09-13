import { Product, User, Cart, IVariant, ICart, ICartItem } from "../../models"
import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import mongoose from "mongoose"
import jwt, { JwtPayload } from "jsonwebtoken"
import { transformCartItem } from "../../utils/cartUtils"
import { getAuthenticatedUser } from "../../utils/getAuthenticatedUser"
import { UpdateCartItem } from "../../types/userCart"

class CartController {
	getCurrentCart = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { userId } = await getAuthenticatedUser(req, res)
			let cartId = req.cookies.cart_id
			// Try to get user ID from access token
			let guestCart = cartId ? await Cart.findById(cartId) : null
			let userCart = userId ? await Cart.findOne({ user_id: userId }) : null

			if (userId && guestCart && userCart) {
				for (const guestItem of guestCart.items) {
					const existingItem = userCart.items.find(
						(item) =>
							item.product_id.toString() === guestItem.product_id.toString() &&
							(!guestItem.variant_id ||
								item.variant_id?.toString() === guestItem.variant_id.toString())
					)

					if (existingItem) {
						existingItem.quantity += guestItem.quantity
					} else {
						userCart.items.push({
							product_id: new mongoose.Types.ObjectId(guestItem.product_id),
							variant_id: guestItem.variant_id
								? new mongoose.Types.ObjectId(guestItem.variant_id)
								: undefined,
							quantity: guestItem.quantity,
						})
					}
				}

				if (guestCart && guestCart._id.toString() !== userCart._id.toString()) {
					if (guestCart.items.length > 0) {
						await userCart.save()
						await Cart.findByIdAndDelete(guestCart._id)
					} else {
						console.log(
							"Skipping deletion since guest cart is empty or already merged."
						)
					}
					// Always ensure the cart ID is correctly assigned
					res.cookie("cart_id", userCart._id.toString(), {
						httpOnly: true,
						sameSite: "none",
						secure: true,
						maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
					})
				} else {
					console.log(
						"Guest cart and user cart are the same, avoiding deletion."
					)
				}

				const populatedCart = await Cart.findById(userCart._id, { new: true })
					.populate({
						path: "items.product_id",
						model: "Product",
						select:
							"title thumbnail price allowVariants variants quantity enableDiscount discount category",
					})
					.select("items.variant_id items.product_id items.quantity")
					.lean()

				res.cookie("cart_id", userCart._id.toString(), {
					httpOnly: true,
					sameSite: "none",
					secure: true,
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				})

				res.json({
					success: true,
					message: "Cart merged successfully",
					data: populatedCart ? populatedCart.items.map(transformCartItem) : [],
				})
				return
			}

			if (userId && guestCart && !userCart) {
				guestCart.user_id = userId
				await guestCart.save()

				const populatedCart = await Cart.findById(guestCart._id)
					.populate({
						path: "items.product_id",
						model: "Product",
						select:
							"title thumbnail price allowVariants variants quantity enableDiscount discount category",
					})
					.select("items.variant_id items.product_id items.quantity")
					.lean()

				res.cookie("cart_id", guestCart._id.toString(), {
					httpOnly: true,
					sameSite: "none",
					secure: true,
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
				})

				res.json({
					success: true,
					message: "Guest cart assigned to user",
					data: populatedCart ? populatedCart.items.map(transformCartItem) : [],
				})
				return
			}

			const currentCart = userCart || guestCart
			if (!currentCart) {
				res.json({
					success: true,
					message: "Currently no item in cart",
					data: [],
				})
				return
			}

			const populatedCart = await Cart.findById(currentCart._id)
				.populate({
					path: "items.product_id",
					model: "Product",
					select:
						"title thumbnail price allowVariants variants quantity enableDiscount discount category",
				})
				.select("items.variant_id items.product_id items.quantity")
				.lean()

			if (!populatedCart || !populatedCart.items.length) {
				res.json({
					success: true,
					message: "No cart populated",
					data: [],
				})
				return
			}

			const transformedCart = populatedCart.items.map(transformCartItem)

			res.json({
				success: true,
				message: "Cart retrieved final",
				data: transformedCart,
			})
		}
	)

	addProductToCart = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { userId } = await getAuthenticatedUser(req, res)
			let cartId = req.cookies.cart_id // Get cart ID from cookies
			const { product_id, variant_id, quantity = 1 } = req.body
			if (!product_id) {
				res.status(400).json({ success: false, message: "Missing product ID" })
			}
			const product = await Product.findById(product_id)
			if (!product) {
				res.status(404).json({ success: false, message: "Product not found" })
				return
			}

			// Validate variant if provided
			let variant: IVariant | null = null
			if (
				variant_id &&
				product.allowVariants &&
				product.variants &&
				product.variants.length > 0
			) {
				variant =
					product.variants.find((v) => v._id.toString() === variant_id) || null
				if (!variant) {
					res.status(404).json({ success: false, message: "Variant not found" })
					return
				}
			}

			let cart

			if (userId) {
				// Logged-in user: Find cart by user ID
				cart = await Cart.findOne({ user_id: userId })
			} else if (cartId) {
				// Guest: Find cart by cart ID
				cart = await Cart.findById(cartId)
			}

			if (!cart) {
				cart = new Cart({
					user_id: userId,
					items: [],
				})

				await cart.save()

				// If guest, store cart ID in an HTTP-only cookie
				if (!userId) {
					res.cookie("cart_id", cart._id.toString(), {
						httpOnly: true,
						sameSite: "none",
						secure: true,
						maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
					})
				}
			}

			// Check if product (and variant, if applicable) already exists in cart
			const existingItem = cart.items.find(
				(item) =>
					item.product_id.toString() === product_id &&
					(!variant_id || item.variant_id?.toString() === variant_id)
			)

			if (existingItem) {
				// Increase quantity if already in cart
				existingItem.quantity += quantity
			} else {
				// Otherwise, add new item
				cart.items.push({
					product_id: new mongoose.Types.ObjectId(product_id),
					variant_id: variant_id
						? new mongoose.Types.ObjectId(variant_id)
						: undefined,
					quantity,
				})
			}

			await cart.save()

			const populatedCart = await Cart.findById(cart._id, { new: true })
				.populate({
					path: "items.product_id",
					model: "Product",
					select:
						"title thumbnail price allowVariants variants quantity enableDiscount discount category",
				})
				.select("items.variant_id items.product_id items.quantity")
				.lean()
			if (!populatedCart) {
				res.status(404).json({
					success: false,
					message: "Cart not found",
				})
				return
			}
			const transformedCart = populatedCart.items.map(transformCartItem)

			res.json({
				success: true,
				message: "Product added to cart",
				data: transformedCart,
			})
		}
	)

	updateCartQuantityItem = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { userId } = await getAuthenticatedUser(req, res)
			let cartId = req.cookies.cart_id // Get cart ID from cookies
			const updateCart: UpdateCartItem[] = req.body

			if (!Array.isArray(updateCart) || updateCart.length === 0) {
				res.status(400).json({ success: false, message: "Missing products" })
				return
			}

			let cart: (Document & ICart) | null = null

			if (userId) {
				cart = await Cart.findOne({ user_id: userId })
			} else if (cartId) {
				cart = await Cart.findById(cartId)
			}

			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" })
				return
			}

			updateCart.forEach(({ product_id, variant_id, quantity }) => {
				const existingItem = cart!.items.find(
					(item) =>
						item.product_id.toString() === product_id &&
						(!variant_id || item.variant_id?.toString() === variant_id)
				)

				if (existingItem) {
					if (quantity <= 0) {
						cart!.items = cart!.items.filter((item) => item !== existingItem)
					} else {
						existingItem.quantity = quantity
					}
				}
			})

			await cart.save()

			const populatedCart = await Cart.findById(cart._id)
				.populate({
					path: "items.product_id",
					model: "Product",
					select:
						"title thumbnail price allowVariants variants quantity enableDiscount discount category",
				})
				.select("items.variant_id items.product_id items.quantity")
				.lean()

			if (!populatedCart) {
				res.status(404).json({
					success: false,
					message: "Cart not found after update",
				})
				return
			}

			const transformedCart = populatedCart.items.map(transformCartItem)

			res.json({
				success: true,
				message: "Cart updated successfully",
				data: transformedCart,
			})
		}
	)

	deleteCartItem = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { userId } = await getAuthenticatedUser(req, res)
			let cartId = req.cookies.cart_id // Get cart ID from cookies

			const { product_id, variant_id } = req.body

			if (!product_id) {
				res.status(400).json({ success: false, message: "Missing product_id" })
				return
			}

			// Explicitly type cart
			let cart: (Document & ICart) | null = null

			if (userId) {
				// Logged-in user: Find cart by user ID
				cart = await Cart.findOne({ user_id: userId })
			} else if (cartId) {
				// Guest: Find cart by cart ID
				cart = await Cart.findById(cartId)
			}

			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" })
				return
			}

			// Filter out the item matching product_id and (if provided) variant_id
			cart.items = cart.items.filter(
				(item) =>
					item.product_id.toString() !== product_id ||
					(variant_id && item.variant_id?.toString() !== variant_id)
			)

			await cart.save()

			// Populate the updated cart before returning the response
			const populatedCart = await Cart.findById(cart._id)
				.populate({
					path: "items.product_id",
					model: "Product",
					select:
						"title thumbnail price allowVariants variants quantity enableDiscount discount category",
				})
				.select("items.variant_id items.product_id items.quantity")
				.lean()

			if (!populatedCart) {
				res.status(404).json({
					success: false,
					message: "Cart not found after deletion",
				})
				return
			}

			const transformedCart = populatedCart.items.map(transformCartItem)

			res.json({
				success: true,
				message: "Product removed from cart",
				data: transformedCart,
			})
		}
	)

	wipeCart = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { userId } = await getAuthenticatedUser(req, res)
			let cartId = req.cookies.cart_id // Get cart ID from cookies
			let cart: (Document & ICart) | null = null

			if (userId) {
				// Logged-in user: Find cart by user ID
				cart = await Cart.findOne({ user_id: userId })
			} else if (cartId) {
				// Guest: Find cart by cart ID
				cart = await Cart.findById(cartId)
			}

			if (!cart) {
				res.status(404).json({ success: false, message: "Cart not found" })
				return
			}

			cart.items = []
			await cart.save()
			res.json({ success: true, message: "Cart has been emptied successfully" })
		}
	)
}

export default new CartController()
