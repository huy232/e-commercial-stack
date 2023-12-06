import express from "express"
import { ProductCategoryController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/",
	[verifyAccessToken, isAdmin],
	ProductCategoryController.createCategory
)
router.get("/", ProductCategoryController.getCategories)
router.put(
	"/:productCategory_id",
	[verifyAccessToken, isAdmin],
	ProductCategoryController.updateCategory
)
router.delete(
	"/:productCategory_id",
	[verifyAccessToken, isAdmin],
	ProductCategoryController.deleteCategory
)

export { router as productCategoryRouter }
