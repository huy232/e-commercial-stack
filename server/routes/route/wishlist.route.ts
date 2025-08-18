import express from "express"
import { WishlistController } from "../../controllers"
import {
	isAdmin,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/",
	[verifyAccessToken],
	WishlistController.addOrRemoveItemToWishlist
)
router.get("/", [verifyAccessToken], WishlistController.getWishlistList)
router.get("/user", [verifyAccessToken], WishlistController.getUserWishlist)

export { router as wishlistRouter }
