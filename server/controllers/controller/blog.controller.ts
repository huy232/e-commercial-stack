import { Request, Response } from "express"
import { Blog } from "../../models"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import { Types } from "mongoose"

interface UpdateQuery {
	$addToSet: {
		likes?: Types.ObjectId
		dislikes?: Types.ObjectId
	}
	$pull: {
		likes?: Types.ObjectId
		dislikes?: Types.ObjectId
	}
}

class BlogController {
	createNewBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { title, description, category } = req.body
			if (!title || !description || !category) {
				throw new Error("Missing inputs required")
			}
			const response = await Blog.create(req.body)
			res.json({
				success: response ? true : false,
				message: response
					? "Success created blog"
					: "Something went wrong while created blog",
				createdBlog: response ? response : {},
			})
		}
	)

	updateBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_id } = req.params
			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs required for updating blog")
			}
			const response = await Blog.findByIdAndUpdate(blog_id, req.body, {
				new: true,
			})
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully update blog"
					: "Something went wrong while updating blog",
				updatedBlog: response ? response : {},
			})
		}
	)

	getBlogs = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Blog.find()
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully get blogs"
					: "Something went wrong while get blogs",
				blogs: response ? response : {},
			})
		}
	)

	likeOrDislikeBlog = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const { blog_id } = req.params
			const { action } = req.query // Use query parameter to specify action

			if (!blog_id || !action) {
				throw new Error("Missing blog_id or action")
			}

			const updateQuery: UpdateQuery = {
				$addToSet: {},
				$pull: {},
			}

			const blog = await Blog.findById(blog_id)

			if (blog) {
				const likedIndex = blog.likes.indexOf(_id)
				const dislikedIndex = blog.dislikes.indexOf(_id)

				if (action === "like") {
					if (likedIndex !== -1) {
						// User already liked, remove like
						updateQuery.$pull.likes = _id
					} else {
						// User neither liked nor disliked, toggle like
						updateQuery.$addToSet.likes = _id
						// Remove from dislikes if present
						if (dislikedIndex !== -1) {
							updateQuery.$pull.dislikes = _id
						}
					}
				} else if (action === "dislike") {
					if (dislikedIndex !== -1) {
						// User already disliked, remove dislike
						updateQuery.$pull.dislikes = _id
					} else {
						// User neither liked nor disliked, toggle dislike
						updateQuery.$addToSet.dislikes = _id
						// Remove from likes if present
						if (likedIndex !== -1) {
							updateQuery.$pull.likes = _id
						}
					}
				} else {
					throw new Error("Invalid action")
				}

				const updatedBlog = await Blog.findByIdAndUpdate(blog_id, updateQuery, {
					new: true,
				})

				res.json({
					success: true,
					message: updatedBlog,
				})
			}
		}
	)

	getBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
		const { blog_id } = req.params

		const selectedField = `firstname lastname email isBlocked`
		const blog = await Blog.findByIdAndUpdate(
			blog_id,
			{ $inc: { numberViews: 1 } },
			{ new: true }
		)
			.populate("likes", selectedField)
			.populate("dislikes", selectedField)
		res.json({
			success: true,
			message: "Success get blog",
			blog,
		})
	})

	deleteBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_id } = req.params
			const blog = await Blog.findByIdAndDelete(blog_id)
			res.json({
				success: true,
				message: "Success deleting a blog",
				deletedBlog: blog,
			})
		}
	)

	uploadImageBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				const { blog_id } = req.params
				if (!req.file) {
					throw new Error("Missing images input")
				}

				const response = await Blog.findByIdAndUpdate(
					blog_id,
					{
						image: req.file.path,
					},
					{ new: true }
				)

				res.json({
					success: response ? true : false,
					message: response
						? "Uploaded blog image"
						: "Failed to upload blog image",
					updatedBlog: response ? response : {},
				})
			} catch (error) {
				console.error("Error uploading image:", error)
				res
					.status(500)
					.json({ success: false, message: "An unexpected error occurred." })
			}
		}
	)
}

export default new BlogController()
