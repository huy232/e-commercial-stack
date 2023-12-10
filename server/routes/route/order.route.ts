import express from "express"
import { OrderController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.post("/", verifyAccessToken, OrderController.createNewOrder)
router.put(
	"/status-order/:order_id",
	[verifyAccessToken, isAdmin],
	OrderController.updateStatusOrder
)
router.get("/", verifyAccessToken, OrderController.getUserOrder)
router.get(
	"/get-orders",
	[verifyAccessToken, isAdmin],
	OrderController.getOrders
)

export { router as orderRouter }
