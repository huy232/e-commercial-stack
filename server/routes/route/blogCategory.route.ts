import express from "express"
import { BlogCategoryController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"

const router = express.Router()

router.post(
	"/",
	[verifyAccessToken, isAdmin],
	BlogCategoryController.createCategory
)
router.get("/", BlogCategoryController.getCategories)
router.put(
	"/:blogCategory_id",
	[verifyAccessToken, isAdmin],
	BlogCategoryController.updateCategory
)
router.delete(
	"/:blogCategory_id",
	[verifyAccessToken, isAdmin],
	BlogCategoryController.deleteCategory
)

export { router as blogCategoryRouter }
