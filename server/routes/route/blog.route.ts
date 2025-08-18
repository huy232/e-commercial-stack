import express from "express"
import { BlogController } from "../../controllers"
import {
	isAdmin,
	optionalAccessToken,
	verifyAccessToken,
} from "../../middlewares/verifyToken"
import { uploadCloudECommercial } from "../../config/cloudinaryOption"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], BlogController.createNewBlog)
router.put("/:blog_id", [verifyAccessToken, isAdmin], BlogController.updateBlog)
router.get("/", BlogController.getAllBlogs)
router.put(
	"/blog-like/:blog_id",
	verifyAccessToken,
	BlogController.likeOrDislikeBlog
)
router.get("/one-blog/:blog_id", BlogController.getBlog)
router.get(
	"/one-blog-by-slug/:blog_slug",
	BlogController.getBlogBySlugForUpdate
)
router.get(
	"/get-blog/:blog_slug",
	optionalAccessToken,
	BlogController.getBlogBySlug
)
router.delete(
	"/:blog_id",
	[verifyAccessToken, isAdmin],
	BlogController.deleteBlog
)
router.get("/highest-view", BlogController.getHighestViewBlogs)
router.get("/blog-category/:category_slug", BlogController.getTopCategoryBlogs)

export { router as blogRouter }
