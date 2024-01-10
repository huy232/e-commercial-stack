import { Request, Response } from "express"
import { BlogCategory } from "../../models"
import asyncHandler from "express-async-handler"

class BlogCategoryController {
	createCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await BlogCategory.create(req.body)
			res.json({
				success: response ? true : false,
				message: response
					? "Success created blog category"
					: "Something went wrong while created blog category",
				data: response ? response : {},
			})
		}
	)

	getCategories = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await BlogCategory.find().select("title _id")
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully get blog category"
					: "Something went wrong while getting blog category",
				data: response ? response : {},
			})
		}
	)

	updateCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blogCategory_id } = req.params

			const response = await BlogCategory.findByIdAndUpdate(
				blogCategory_id,
				req.body,
				{ new: true }
			)
			res.json({
				success: response ? true : false,
				message: response
					? "Success update blog category"
					: "Something went wrong while update blog category",
				data: response ? response : {},
			})
		}
	)

	deleteCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { blogCategory_id } = req.params

			const response = await BlogCategory.findByIdAndDelete(blogCategory_id)
			res.json({
				success: response ? true : false,
				message: response
					? "Success delete a blog category"
					: "Something went wrong while delete blog category",
				data: response ? response : {},
			})
		}
	)
}

export default new BlogCategoryController()
