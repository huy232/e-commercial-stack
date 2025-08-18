import express from "express"
import { NotifyController } from "../../controllers"
import {
	isAdmin,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/",
	[verifyAccessToken, isAdmin],
	NotifyController.createUserNotification
)
router.get("/", [verifyAccessToken], NotifyController.getUserNotifications)
// router.get("/user", [verifyAccessToken], NotifyController.getUserNotifications)
router.put(
	"/mark-all-as-read",
	[verifyAccessToken],
	NotifyController.markNotificationsAsRead
)

export { router as notifyRouter }
