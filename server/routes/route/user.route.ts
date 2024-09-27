import express from "express"
import { UserController } from "../../controllers"
import {
	isAdmin,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../middlewares/verifyToken"
import { uploadCloudAvatarFolder } from "../../config/cloudinaryOption"

const router = express.Router()

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/current", verifyAccessToken, UserController.getCurrentUser)
router.post("/refresh-token", UserController.refreshAccessToken)
router.post("/logout", UserController.logout)
router.post("/forgot-password", UserController.forgotPassword)
router.put("/reset-password", UserController.resetPassword)
router.get(
	"/get-all-users",
	[verifyAccessToken, isAdmin],
	UserController.getAllUsers
)
router.delete(
	"/delete-user",
	[verifyAccessToken, isAdmin],
	UserController.deleteUser
)
router.put(
	"/user-update",
	verifyAccessToken,

	uploadCloudAvatarFolder.fields([{ name: "avatar", maxCount: 1 }]),
	UserController.updateUser
)
router.put(
	"/user-update/:uid",
	[verifyAccessToken, isAdmin],
	UserController.updateUserByAdmin
)
router.put(
	"/user-update-address",
	verifyAccessToken,
	UserController.updateUserAddress
)
router.post("/update-cart", verifyAccessToken, UserController.updateUserCart)
router.put("/update-cart", verifyAccessToken, UserController.updateBulkUserCart)
router.get(
	"/validate-refresh-token",
	verifyRefreshToken,
	UserController.verifyRefreshToken
)
router.get(
	"/validate-access-token",
	verifyAccessToken,
	UserController.verifyAccessToken
)
router.get(
	"/check-auth",
	[verifyAccessToken, verifyRefreshToken],
	UserController.checkAuth
)
router.post("/complete-registration", UserController.verifyRegister)
router.get(
	"/check-admin",
	[verifyAccessToken, isAdmin],
	UserController.checkAdmin
)
router.post("/wishlist", verifyAccessToken, UserController.userWishlist)
router.get("/wishlist", verifyAccessToken, UserController.getUserWishlist)

export { router as userRouter }
