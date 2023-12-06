import express from "express"
import { UserController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

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

export { router as userRouter }
