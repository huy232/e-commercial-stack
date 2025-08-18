import { Request, Response } from "express"
import { AuthenticatedRequest } from "../../types/user"
import { NotifyService } from "../../services"
class NotifyController {
	createUserNotification = async (req: AuthenticatedRequest, res: Response) => {
		try {
			const io = req.app.get("io")
			const { user_id } = req.body
			if (!user_id) {
				return res.status(400).json({ error: "Missing required fields" })
			}
			const { message, product_id } = req.body
			if (!product_id || !message) {
				return res.status(400).json({ error: "Missing required fields" })
			}
			await NotifyService.notifyWishlistUsers(product_id, io)
			res.status(200).json({ success: true, message: "Notifications sent" })
		} catch (error) {
			console.error(error)
			res.status(500).json({ success: false, message: "Server error" })
		}
	}

	getUserNotifications = async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { _id } = req.user

			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 5
			const type = (req.query.type as string) || "all"

			console.log("Filter: ", type)

			if (!["all", "unread", "read"].includes(type)) {
				return res.status(400).json({
					success: false,
					message: "Invalid filter. Use 'all', 'unread', or 'read'.",
					data: {
						notification: [],
					},
				})
			}

			const {
				notifications,
				total,
				unreadCount,
				totalPages,
				hasNextPage,
				hasPrevPage,
				currentPage,
			} = await NotifyService.getUserNotifications(
				_id,
				page,
				limit,
				type as "all" | "unread" | "read"
			)

			res.json({
				success: true,
				data: {
					notifications,
					total,
					unreadCount,
					currentPage,
					totalPages,
					hasNextPage,
					hasPrevPage,
				},
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ success: false, message: "Server error" })
		}
	}

	markNotificationsAsRead = async (
		req: AuthenticatedRequest,
		res: Response
	) => {
		try {
			const { _id } = req.user
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 5

			const {
				notifications,
				total,
				unreadCount,
				totalPages,
				hasNextPage,
				hasPrevPage,
			} = await NotifyService.getUserNotifications(_id, page, limit)
			// await NotifyService.markNotificationsAsRead(_id)
			// const notifications = await NotifyService.getUserNotifications(_id)
			// const unreadCount = await NotifyService.countUnreadNotifications(_id)

			res.json({
				success: true,
				data: {
					notifications,
					total,
					unreadCount,
					currentPage: page,
					totalPages,
					hasNextPage,
					hasPrevPage,
				},
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({ success: false, message: "Server error" })
		}
	}
}

export default new NotifyController()
