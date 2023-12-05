import { Request, Response } from "express"
import { ProductCategory } from "../models"
import asyncHandler from "express-async-handler"

// ------------------------
const createCategory = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const response = await ProductCategory.create(req.body)
		res.json({
			success: response ? true : false,
			message: response
				? "Success created category"
				: "Something went wrong while created category",
			createCategory: response ? response : {},
		})
	}
)
// ------------------------
const getCategories = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const response = await ProductCategory.find().select("title _id")
		res.json({
			success: response ? true : false,
			message: response
				? "Successfully get category"
				: "Something went wrong while getting category",
			productCategory: response ? response : {},
		})
	}
)
// ------------------------
const updateCategory = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { productCategory_id } = req.params

		const response = await ProductCategory.findByIdAndUpdate(
			productCategory_id,
			req.body,
			{ new: true }
		)
		res.json({
			success: response ? true : false,
			message: response
				? "Success update category"
				: "Something went wrong while update category",
			updatedCategory: response ? response : {},
		})
	}
)
// ------------------------
const deleteCategory = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { productCategory_id } = req.params

		const response = await ProductCategory.findByIdAndDelete(productCategory_id)
		res.json({
			success: response ? true : false,
			message: response
				? "Success delete a category"
				: "Something went wrong while delete category",
			deletedCategory: response ? response : {},
		})
	}
)

export default { createCategory, getCategories, updateCategory, deleteCategory }
