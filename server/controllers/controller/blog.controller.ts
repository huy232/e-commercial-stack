import { Request, Response } from "express"
import { Blog, BlogCategory } from "../../models"
import asyncHandler from "express-async-handler"
import { AuthenticatedRequest } from "../../types/user"
import { Types } from "mongoose"
import { parseInteger } from "../../utils/parseInteger"
import { v2 as cloudinary } from "cloudinary"
import * as cheerio from "cheerio"
import slugify from "slugify"
import { JwtPayload } from "jsonwebtoken"

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
			const {
				title,
				description,
				relatedProducts,
				author,
				image,
				relatedBlogCategory,
			} = req.body
			if (!title || !description || !author || !image) {
				throw new Error("Missing inputs required")
			}
			const response = await Blog.create({
				title,
				description,
				relatedProducts: relatedProducts || [],
				author,
				image,
				slug: slugify(title, {
					lower: true,
					strict: true,
					locale: "vi",
					replacement: "-",
				}),
				relatedBlogCategory: relatedBlogCategory || null,
			})
			res.json({
				success: response ? true : false,
				message: response
					? "Success created blog"
					: "Something went wrong while created blog",
				data: response ? response : {},
			})
		}
	)

	updateBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_id } = req.params

			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs required for updating blog")
			}

			const updatedData: any = { ...req.body }

			if (updatedData.title) {
				updatedData.slug = slugify(updatedData.title, {
					lower: true,
					strict: true,
					locale: "vi",
					replacement: "-",
				})
			}

			const response = await Blog.findByIdAndUpdate(blog_id, updatedData, {
				new: true,
			})

			res.json({
				success: !!response,
				message: response
					? "Successfully updated blog"
					: "Something went wrong while updating blog",
				data: response || {},
			})
		}
	)

	getAllBlogs = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { category } = req.query
			const query: any = {}

			// If category slug is provided, find the corresponding category first
			if (category) {
				const categoryDoc = await BlogCategory.findOne({ slug: category })
				if (categoryDoc) {
					query.relatedBlogCategory = categoryDoc._id
				} else {
					// Optional: return empty if category not found
					res.json({
						success: true,
						message: "No blogs found for this category",
						data: [],
						pagination: { totalPages: 0 },
					})
				}
			}

			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 10
			const skip = (page - 1) * limit

			const total = await Blog.countDocuments(query)
			const blogs = await Blog.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate("relatedProducts", "title thumbnail price slug")
				.populate("relatedBlogCategory", "title slug image description")
				.populate("author", "firstName lastName avatar")

			res.json({
				success: true,
				message: "Blogs fetched successfully",
				data: blogs,
				pagination: {
					totalPages: Math.ceil(total / limit),
				},
			})
		}
	)

	getHighestViewBlogs = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const limit = parseInteger(req.query.limit, 6)
			const blogs = await Blog.find({})
				.sort({ numberViews: -1 })
				.limit(limit)
				.populate("relatedProducts", "title thumbnail price slug")
				.populate(
					"relatedBlogCategory",
					"title slug image description createdAt updatedAt"
				)
				.populate("author", "firstName lastName avatar")
			res.json({
				success: true,
				message: "Successfully fetched highest view blogs",
				data: blogs,
			})
		}
	)

	getTopCategoryBlogs = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const limit = parseInteger(req.query.limit, 5)
			const blogCategorySlug = req.params.category_slug
			if (!blogCategorySlug) {
				res.status(400).json({
					success: false,
					message: "Missing category slug in query",
				})
				return
			}

			// Find the category by slug
			const category = await BlogCategory.findOne({ slug: blogCategorySlug })
			if (!category) {
				res.status(404).json({
					success: false,
					message: "Blog category not found",
				})
				return
			}
			const blogs = await Blog.find({ relatedBlogCategory: category._id })
				.sort({ createdAt: -1 }) // newest blogs first
				.limit(limit)
				.populate("relatedProducts", "title thumbnail price slug")
				.populate("relatedBlogCategory", "title slug description slug")
				.populate("author", "firstName lastName avatar")

			res.json({
				success: true,
				message: "Successfully fetched newest blogs by category",
				data: blogs,
			})
		}
	)

	likeOrDislikeBlog = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const userId =
				(req.user as JwtPayload | undefined)?._id?.toString() || null
			const { blog_id } = req.params
			const { action } = req.body // Use query parameter to specify action

			if (!blog_id || !action) {
				throw new Error("Missing blog_id or action")
			}

			const updateQuery: UpdateQuery = {
				$addToSet: {},
				$pull: {},
			}

			const blog = await Blog.findById(blog_id)

			if (blog) {
				const likedIndex = blog.likes.indexOf(userId)
				const dislikedIndex = blog.dislikes.indexOf(userId)

				if (action === "like") {
					if (likedIndex !== -1) {
						// User already liked, remove like
						updateQuery.$pull.likes = userId
					} else {
						// User neither liked nor disliked, toggle like
						updateQuery.$addToSet.likes = userId
						// Remove from dislikes if present
						if (dislikedIndex !== -1) {
							updateQuery.$pull.dislikes = userId
						}
					}
				} else if (action === "dislike") {
					if (dislikedIndex !== -1) {
						// User already disliked, remove dislike
						updateQuery.$pull.dislikes = userId
					} else {
						// User neither liked nor disliked, toggle dislike
						updateQuery.$addToSet.dislikes = userId
						// Remove from likes if present
						if (likedIndex !== -1) {
							updateQuery.$pull.likes = userId
						}
					}
				} else {
					throw new Error("Invalid action")
				}

				const updatedBlog = await Blog.findByIdAndUpdate(blog_id, updateQuery, {
					new: true,
				})

				const likes = updatedBlog?.likes?.length || 0
				const dislikes = updatedBlog?.dislikes?.length || 0
				const alreadyLiked =
					updatedBlog?.likes?.some(
						(user: any) => user._id.toString() === userId
					) ?? false
				const alreadyDisliked =
					updatedBlog?.dislikes?.some(
						(user: any) => user._id.toString() === userId
					) ?? false

				res.json({
					success: true,
					data: {
						likes,
						dislikes,
						alreadyLiked,
						alreadyDisliked,
					},
				})
			}
		}
	)

	getBlogs = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 6
			const skip = (page - 1) * limit

			const search = (req.query.search as string) || ""
			const type = (req.query.type as string) || "title" // title or username
			const sortBy = (req.query.sortBy as string) || "createdAt"
			const order = req.query.order === "asc" ? 1 : -1

			// Format query object
			const formattedQueries: any = {}

			if (search && type === "title") {
				formattedQueries.title = { $regex: search, $options: "i" }
			}

			if (search && type === "username") {
				formattedQueries["author.username"] = { $regex: search, $options: "i" }
			}

			// Build query
			const query = Blog.find(formattedQueries)
				.skip(skip)
				.limit(limit)
				.sort({ [sortBy]: order })
				.populate("relatedProducts", "title thumbnail price slug")
				.populate(
					"relatedBlogCategory",
					"title slug image description createdAt updatedAt"
				)
				.populate("author", "firstName lastName avatar")

			const [blogs, counts] = await Promise.all([
				query.exec(),
				Blog.countDocuments(formattedQueries),
			])

			const totalPages = Math.ceil(counts / limit) || 1

			res.json({
				success: true,
				message: "Successfully fetched blogs",
				data: blogs,
				pagination: {
					totalItems: counts,
					totalPages,
					currentPage: page,
					limit,
				},
			})
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
			.populate("relatedProducts", "title thumbnail price slug")
			.populate(
				"relatedBlogCategory",
				"name slug image description createdAt updatedAt"
			)
			.populate("author", "firstName lastName avatar")
		res.json({
			success: true,
			message: "Success get blog",
			data: blog,
		})
	})

	getBlogBySlugForUpdate = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_slug } = req.params
			const selectedFields = "firstname lastname email isBlocked"

			const blog = await Blog.findOne({ slug: blog_slug })
				.populate("likes", selectedFields)
				.populate("dislikes", selectedFields)
				.populate("author", "firstName lastName avatar")
				.populate("relatedProducts", "title thumbnail price slug")
			if (!blog) {
				res.status(404).json({
					success: false,
					message: "Blog not found",
				})
				return
			}

			res.json({
				success: true,
				message: "Successfully retrieved blog",
				data: blog,
			})
		}
	)

	getBlogBySlug = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_slug } = req.params
			const userId =
				(req.user as JwtPayload | undefined)?._id?.toString() || null
			const selectedFields = "firstname lastname email isBlocked"

			// Increment the view count and return the updated document
			const blog = await Blog.findOneAndUpdate(
				{ slug: blog_slug },
				{ $inc: { numberViews: 1 } },
				{ new: true }
			)
				.populate("likes", selectedFields)
				.populate("dislikes", selectedFields)
				.populate("author", "firstName lastName avatar")
				.populate("relatedProducts", "title thumbnail price slug")
				.populate(
					"relatedBlogCategory",
					"title slug image description createdAt updatedAt"
				)

			if (!blog) {
				res.status(404).json({
					success: false,
					message: "Blog not found",
				})
				return
			}

			const alreadyLiked = userId
				? blog.likes.some((user) => user._id.toString() === userId)
				: false

			const alreadyDisliked = userId
				? blog.dislikes.some((user) => user._id.toString() === userId)
				: false

			res.json({
				success: true,
				message: "Successfully retrieved blog",
				data: {
					...blog.toObject(), // Convert Mongoose doc to plain object
					alreadyLiked,
					alreadyDisliked,
					likes: blog.likes.length,
					dislikes: blog.dislikes.length,
				},
			})
		}
	)

	deleteBlog = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blog_id } = req.params
			const blog = await Blog.findById(blog_id)

			if (!blog) {
				res.status(404)
				throw new Error("Blog not found")
			}

			const $ = cheerio.load(blog.description || "")
			const imgSrcs: string[] = []
			$("img").each((_, img) => {
				const src = $(img).attr("src")
				if (src && src.includes("res.cloudinary.com")) {
					imgSrcs.push(src)
				}
			})

			for (const url of imgSrcs) {
				const matches = url.match(/\/v\d+\/([^\.]+)\.(jpg|jpeg|png|webp|gif)/)
				if (matches && matches[1]) {
					const publicId = matches[1]
					try {
						await cloudinary.uploader.destroy(publicId)
					} catch (error) {
						console.error(`Failed to delete image: ${publicId}`, error)
					}
				}
			}

			await blog.deleteOne()

			res.json({
				success: true,
				message: "Success deleting a blog",
				data: blog,
			})
		}
	)
}

export default new BlogController()
