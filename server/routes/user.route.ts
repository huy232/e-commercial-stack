import express, { Router } from "express"
import userController from "../controllers/user.controller"
import { verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/current", verifyAccessToken, userController.getCurrentUser)

export default { router }
