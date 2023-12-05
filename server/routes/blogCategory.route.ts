import express from "express"
import blogCategory from "../controllers/blogCategory.controller"
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], blogCategory.createCategory)
router.get("/", blogCategory.getCategories)
router.put(
	"/:blogCategory_id",
	[verifyAccessToken, isAdmin],
	blogCategory.updateCategory
)
router.delete(
	"/:blogCategory_id",
	[verifyAccessToken, isAdmin],
	blogCategory.deleteCategory
)

export default { router }
