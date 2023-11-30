import express, { Router } from "express"
import userController from "../controllers/user.controller"
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/current", verifyAccessToken, userController.getCurrentUser)
router.post("/refresh-token", userController.refreshAccessToken)
router.post("/logout", userController.logout)
router.get("/forgot-password", userController.forgotPassword)
router.put("/reset-password", userController.resetPassword)
router.get(
	"/get-all-users",
	[verifyAccessToken, isAdmin],
	userController.getAllUsers
)
router.delete(
	"/delete-user",
	[verifyAccessToken, isAdmin],
	userController.deleteUser
)
router.put("/user-update", verifyAccessToken, userController.updateUser)
router.put(
	"/user-update/:uid",
	[verifyAccessToken, isAdmin],
	userController.updateUserByAdmin
)

export default { router }
