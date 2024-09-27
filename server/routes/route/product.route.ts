import express from "express"
import { ProductController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"
import { uploadCloudECommercial } from "../../config/cloudinaryOption"

const router = express.Router()

router.post(
	"/create-product",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.fields([
		{ name: "productImages", maxCount: 10 },
		{
			name: "thumbnail",
			maxCount: 1,
		},
	]),
	ProductController.createProduct
)
router.get("/get-product/:product_slug", ProductController.getProduct)
router.get("/get-all-product", ProductController.getAllProducts)
router.put(
	"/update-product/:product_id",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.fields([
		{ name: "productImages", maxCount: 10 },
		{
			name: "thumbnail",
			maxCount: 1,
		},
	]),
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
	uploadCloudECommercial.array("images", 10),
	ProductController.uploadImagesProduct
)
router.put(
	"/variant/:product_id",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.fields([
		{ name: "productImages", maxCount: 10 },
		{
			name: "thumbnail",
			maxCount: 1,
		},
	]),
	ProductController.addVariant
)

router.get("/daily-product", ProductController.getRandomProductWithFiveStars)
router.get(
	"/product-distribution",
	verifyAccessToken,
	ProductController.getProductCategoryCounts
)

export { router as productRouter }
