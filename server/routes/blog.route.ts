import express from "express"
import blog from "../controllers/blog.controller"
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken"

const router = express.Router()

router.post("/", [verifyAccessToken, isAdmin], blog.createNewBlog)
router.put("/:blog_id", [verifyAccessToken, isAdmin], blog.updateBlog)
router.get("/", blog.getBlogs)
router.put("/blog-like/:blog_id", verifyAccessToken, blog.likeOrDislikeBlog)

export default { router }
