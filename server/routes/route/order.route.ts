import express from "express"
import { OrderController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.post("/", verifyAccessToken, OrderController.createNewOrder)
router.post(
	"/create-payment-intent",
	verifyAccessToken,
	OrderController.createPaymentIntent
)
router.post(
	"/create-checkout-session",
	verifyAccessToken,
	OrderController.createCheckoutSession
)
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
router.put(
	"/update-orders",
	[verifyAccessToken, isAdmin],
	OrderController.updateOrders
)
router.get(
	"/specific-order",
	[verifyAccessToken],
	OrderController.getSpecificOrder
)

router.get(
	"/monthly",
	[verifyAccessToken, isAdmin],
	OrderController.getOrdersByMonth
)
router.get(
	"/monthly-price",
	[verifyAccessToken, isAdmin],
	OrderController.getTotalOrderSumsByMonth
)

router.get(
	"/newest-order",
	[verifyAccessToken, isAdmin],
	OrderController.getNewestOrders
)
// router.post("/webhook", OrderController.handleWebhook)

export { router as orderRouter }
