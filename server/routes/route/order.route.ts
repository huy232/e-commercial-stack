import express from "express"
import { OrderController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"
import uploadCloud from "../../config/cloudinary.config"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], OrderController.createNewOrder)

export { router as orderRouter }
