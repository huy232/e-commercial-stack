import express from "express"
import productController from "../controllers/product.controller"
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/create-product",
	[verifyAccessToken, isAdmin],
	productController.createProduct
)
router.get("/get-product/:product_id", productController.getProduct)
router.get("/get-all-product", productController.getAllProducts)
router.put(
	"/update-product/:product_id",
	[verifyAccessToken, isAdmin],
	productController.updateProduct
)
router.delete(
	"/delete-product/:product_id",
	[verifyAccessToken, isAdmin],
	productController.deleteProduct
)

export default { router }
