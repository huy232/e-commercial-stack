import express from "express"
import productCategoryController from "../controllers/productCategory.controller"
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/",
	[verifyAccessToken, isAdmin],
	productCategoryController.createCategory
)
router.get("/", productCategoryController.getCategories)
router.put(
	"/:productCategory_id",
	[verifyAccessToken, isAdmin],
	productCategoryController.updateCategory
)
router.delete(
	"/:productCategory_id",
	[verifyAccessToken, isAdmin],
	productCategoryController.deleteCategory
)

export default { router }
