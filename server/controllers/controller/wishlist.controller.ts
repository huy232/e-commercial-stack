import { Wishlist } from "../../models"
import { Request, Response } from "express"
import { AuthenticatedRequest } from "../../types/user"

class WishlistController {
	addOrRemoveItemToWishlist = async (
		req: AuthenticatedRequest,
		res: Response
	) => {
		try {
			const { _id } = req.user
			const { product_id } = req.body

			const wishlistUser = await Wishlist.findOne({ user_id: _id })

			if (!wishlistUser) {
				const wishlistItem = await Wishlist.create({
					user_id: _id,
					items: [{ product_id }],
				})
				return res.status(201).json({
					success: true,
					message: "Item added to wishlist",
					data: wishlistItem.items,
				})
			}

			if (!wishlistUser.items) {
				wishlistUser.items = []
			}

			const itemIndex = wishlistUser.items.findIndex(
				(item) => item.product_id?.toString() === product_id
			)

			if (itemIndex !== -1) {
				wishlistUser.items.splice(itemIndex, 1)
				const wishlistItem = await wishlistUser.save()
				return res.status(200).json({
					success: true,
					message: "Item removed from wishlist",
					data: wishlistItem.items,
				})
			}

			wishlistUser.items.push({ product_id })
			const wishlistItem = await wishlistUser.save()
			return res.status(201).json({
				success: true,
				message: "Item added to wishlist",
				data: wishlistItem.items,
			})
		} catch (error) {
			console.error("Error adding/removing wishlist item:", error)
			res.status(500).json({ success: false, message: "Server error" })
		}
	}

	getUserWishlist = async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { _id } = req.user
			const { page = 1, limit = 10 } = req.query

			if (!_id) {
				return res.status(400).json({
					success: false,
					message: "User ID is required",
				})
			}

			// Find the wishlist and populate the product details
			const wishlistUser = await Wishlist.findOne({ user_id: _id }).populate(
				"items.product_id"
			)

			// If no wishlist is found, return an empty array
			if (!wishlistUser) {
				return res.status(200).json({
					success: true,
					wishlist: [],
					totalItems: 0,
					totalPages: 0,
					currentPage: 1,
					hasNextPage: false,
				})
			}

			// Extract wishlist items
			const wishlist = wishlistUser.items || []
			const totalItems = wishlist.length
			const totalPages = Math.ceil(totalItems / Number(limit))
			const currentPage = Number(page)
			const hasNextPage = currentPage < totalPages

			// Paginate results
			const paginatedWishlist = wishlist.slice(
				(currentPage - 1) * Number(limit),
				currentPage * Number(limit)
			)

			return res.status(200).json({
				success: true,
				wishlist: paginatedWishlist,
				totalItems,
				totalPages,
				currentPage,
				hasNextPage,
			})
		} catch (error) {
			console.error("Error fetching wishlist:", error)
			return res.status(500).json({ success: false, message: "Server error" })
		}
	}

	getWishlistList = async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { _id } = req.user
			const wishlistUser = await Wishlist.findOne({ user_id: _id })
			// .populate(
			// 	"items.product_id"
			// )

			if (!wishlistUser || !wishlistUser.items) {
				return res.status(200).json({ success: true, wishlist: [] })
			}

			return res.status(200).json({ success: true, data: wishlistUser.items })
		} catch (error) {
			console.error("Error fetching wishlist:", error)
			return res.status(500).json({ success: false, message: "Server error" })
		}
	}
}

export default new WishlistController()
