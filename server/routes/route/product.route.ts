import express from "express"
import { ProductController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"
import uploadCloud from "../../config/cloudinary.config"
const router = express.Router()

router.post(
	"/create-product",
	[verifyAccessToken, isAdmin],
	ProductController.createProduct
)
router.get("/get-product/:product_id", ProductController.getProduct)
router.get("/get-all-product", ProductController.getAllProducts)
router.put(
	"/update-product/:product_id",
	[verifyAccessToken, isAdmin],
	ProductController.updateProduct
)
router.delete(
	"/delete-product/:product_id",
	[verifyAccessToken, isAdmin],
	ProductController.deleteProduct
)
router.put(
	"/rating-product",
	verifyAccessToken,
	ProductController.ratingProduct
)
router.put(
	"/upload-image/:product_id",
	[verifyAccessToken, isAdmin],
	uploadCloud.array("images", 10),
	ProductController.uploadImagesProduct
)

export { router as productRouter }
