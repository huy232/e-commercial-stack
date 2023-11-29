import express, { Router } from "express"
import userController from "../controllers/user.controller"
import { verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/current", verifyAccessToken, userController.getCurrentUser)
router.post("/refresh-token", userController.refreshAccessToken)
router.post("/logout", userController.logout)

export default { router }
