import { Request, Response } from "express"
import { BlogCategory } from "../models"
import asyncHandler from "express-async-handler"

const createCategory = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const response = await BlogCategory.create(req.body)
		res.json({
			success: response ? true : false,
			message: response
				? "Success creating blog category"
				: "Something went wrong while creating blog category",
			createCategory: response ? response : {},
		})
	}
)

const getCategories = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const response = await BlogCategory.find().select("title _id")
		res.json({
			success: response ? true : false,
			message: response
				? "Successfully get blog category"
				: "Something went wrong while getting blog category",
			blogCategory: response ? response : {},
		})
	}
)

const updateCategory = asyncHandler(
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
			updatedCategory: response ? response : {},
		})
	}
)

const deleteCategory = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { blogCategory_id } = req.params

		const response = await BlogCategory.findByIdAndDelete(blogCategory_id)
		res.json({
			success: response ? true : false,
			message: response
				? "Success delete a blog category"
				: "Something went wrong while delete blog category",
			deletedCategory: response ? response : {},
		})
	}
)

export default { createCategory, getCategories, updateCategory, deleteCategory }
