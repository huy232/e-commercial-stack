import express from "express"
import { UserController } from "../../controllers"
import {
	isAdmin,
	verifyAccessToken,
	verifyRefreshToken,
} from "../../middlewares/verifyToken"

const router = express.Router()

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/current", verifyAccessToken, UserController.getCurrentUser)
router.post("/refresh-token", UserController.refreshAccessToken)
router.post("/logout", UserController.logout)
router.get("/forgot-password", UserController.forgotPassword)
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
router.put("/user-update", verifyAccessToken, UserController.updateUser)
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
router.put("/update-cart", verifyAccessToken, UserController.updateUserCart)

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

export { router as userRouter }
