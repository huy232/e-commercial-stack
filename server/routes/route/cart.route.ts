import express from "express"
import { verifyAccessToken } from "../../middlewares/verifyToken"
import { CartController } from "../../controllers"

const router = express.Router()

router.get("/", CartController.getCurrentCart)
router.post("/", CartController.addProductToCart)
router.put("/", CartController.updateCartQuantityItem)
router.delete("/", CartController.deleteCartItem)
router.delete("/wipe-cart", CartController.wipeCart)

export { router as cartRouter }
