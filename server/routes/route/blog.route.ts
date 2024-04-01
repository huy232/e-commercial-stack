import express from "express"
import { BlogController } from "../../controllers"
import { isAdmin, verifyAccessToken } from "../../middlewares/verifyToken"
import { uploadCloudECommercial } from "../../config/cloudinaryOption"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], BlogController.createNewBlog)
router.put("/:blog_id", [verifyAccessToken, isAdmin], BlogController.updateBlog)
router.get("/", BlogController.getBlogs)
router.put(
	"/blog-like/:blog_id",
	verifyAccessToken,
	BlogController.likeOrDislikeBlog
)
router.get("/one-blog/:blog_id", BlogController.getBlog)
router.delete(
	"/:blog_id",
	[verifyAccessToken, isAdmin],
	BlogController.deleteBlog
)

router.put(
	"/upload-image/:blog_id",
	[verifyAccessToken, isAdmin],
	uploadCloudECommercial.single("image"),
	BlogController.uploadImageBlog
)

export { router as blogRouter }
