import mongoose from "mongoose"
import { userSockets } from "../../config/socket"
import { Notify, Product, Wishlist } from "../../models"

class NotifyService {
	async notifyWishlistUsers(product_id: string, io: any) {
		const product = await Product.findById(product_id).select(
			"title discount price"
		)
		if (!product) return

		// Determine if the discount is still valid
		const productDiscountAvailable =
			product.discount?.expirationDate &&
			new Date(product.discount.expirationDate) > new Date()

		let discountMessage = "Check it out now!"

		if (productDiscountAvailable) {
			if (product.discount?.type === "percentage") {
				discountMessage = `Now at ${product.discount?.value}% off!`
			} else if (product.discount?.type === "fixed") {
				const formattedPrice = new Intl.NumberFormat("vi-VN", {
					style: "currency",
					currency: "VND",
				}).format(product.discount?.value)

				discountMessage = `Now reduced by ${formattedPrice}!`
			}
		}

		const message = `The product "${product.title}" is now on sale! ${discountMessage}`

		// Find users who have the product in their wishlist
		const wishlists = await Wishlist.find({
			"items.product_id": product_id,
		}).select("user_id")

		if (!wishlists.length) return

		const userIds = wishlists.map((wishlist) => String(wishlist.user_id))

		// Get online users' socket IDs
		const socketIds: string[] = []
		userIds.forEach((userId) => {
			const socketId = userSockets.get(userId)
			if (socketId) socketIds.push(socketId)
		})

		const bulkOperations = userIds.map((userId) => ({
			updateOne: {
				filter: { user_id: new mongoose.Types.ObjectId(userId) },
				update: {
					$push: {
						notifications: {
							$each: [
								{
									message,
									product_id: new mongoose.Types.ObjectId(product_id),
									isRead: false,
									createdAt: new Date(),
								},
							],
						},
					},
				},
				upsert: true,
			},
		}))

		await Notify.bulkWrite(bulkOperations)

		// Emit notifications to online users
		socketIds.forEach((socketId) => {
			io?.to(socketId).emit("newNotification", { message, product_id })
		})
	}

	async getUserNotifications(
		userId: string,
		page: number = 1,
		limit: number = 5,
		type: "all" | "unread" | "read" = "all"
	) {
		const skip = (page - 1) * limit

		// Find the user's notifications
		const userNotifications = await Notify.findOne({ user_id: userId })
			.populate({
				path: "notifications.product_id",
				select: "title slug discount",
			})
			.lean()

		if (!userNotifications) {
			return {
				notifications: [],
				total: 0,
				unreadCount: 0,
				hasNextPage: false,
				hasPrevPage: false,
				currentPage: page,
				totalPages: 1,
			}
		}
		let filteredNotifications = userNotifications.notifications

		if (type === "unread") {
			filteredNotifications = filteredNotifications.filter((n) => !n.isRead)
		} else if (type === "read") {
			filteredNotifications = filteredNotifications.filter((n) => n.isRead)
		}

		const totalNotifications = filteredNotifications.length

		const paginatedNotifications = filteredNotifications
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			) // Sort by newest first
			.slice(skip, skip + limit) // Paginate manually

		const unreadCount = userNotifications.notifications.filter(
			(n) => !n.isRead
		).length

		// Calculate if there is a next or previous page
		const totalPages = Math.ceil(totalNotifications / limit)
		const hasNextPage = page < totalPages
		const hasPrevPage = page > 1

		return {
			notifications: paginatedNotifications,
			total: totalNotifications,
			unreadCount,
			currentPage: page,
			totalPages,
			hasNextPage,
			hasPrevPage,
		}
	}

	async markNotificationsAsRead(userId: string) {
		await Notify.updateMany(
			{ user_id: userId },
			{ $set: { "notifications.$[].isRead": true } }
		)
	}

	async countUnreadNotifications(userId: string) {
		const userNotifications = await Notify.findOne(
			{ user_id: userId },
			{ "notifications.isRead": 1 }
		).lean()

		if (!userNotifications) return 0

		// Count unread notifications
		const unreadCount = userNotifications.notifications.filter(
			(n) => !n.isRead
		).length

		return unreadCount
	}

	async createNotification(
		userId: string,
		message: string,
		product_id: string,
		io: any
	) {
		const notification = await Notify.create({
			user_id: userId,
			message,
			product_id,
			isRead: false,
		})

		io.to(userId).emit("newNotification", notification)
	}
}

export default new NotifyService()
