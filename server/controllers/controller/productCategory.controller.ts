import { Request, Response } from "express"
import { ProductCategory } from "../../models"
import asyncHandler from "express-async-handler"
import { parseInteger } from "../../utils/parseInteger"
import slugify from "slugify"

class ProductCategoryController {
	createCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { title } = req.body
			const slug = slugify(title, {
				trim: true,
				lower: true,
			})

			const response = await ProductCategory.create({ title, slug })
			const io = req.app.get("io")
			io.emit("categoryUpdate")
			res.json({
				success: response ? true : false,
				message: response
					? "Success created category"
					: "Something went wrong while created category",
				data: response ? response : {},
			})
		}
	)

	getCategories = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const page = parseInteger(req.query.page, 1)
			const limit = parseInteger(req.query.limit, 10)
			const totalCategories = await ProductCategory.countDocuments()
			const totalPages = Math.ceil(totalCategories / limit)
			const hasNextPage = page < totalPages
			const query = ProductCategory.find()
				.populate("brand", "title")
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
			const response = await query.exec()
			res.json({
				success: response ? true : false,
				message: response
					? "Successfully get category"
					: "Something went wrong while getting category",
				data: response ? response : {},
				hasNextPage,
				totalPages,
				totalCategories,
			})
		}
	)

	updateCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { productCategory_id } = req.params
			const { brand } = req.body
			if (!productCategory_id && !brand) {
				throw new Error("Missing product category ID or brands to update")
			}
			const response = await ProductCategory.findByIdAndUpdate(
				{ _id: productCategory_id, brand: brand },
				req.body,
				{ new: true }
			)
			const io = req.app.get("io")
			io.emit("categoryUpdate")
			res.json({
				success: response ? true : false,
				message: response
					? "Success update category brand"
					: "Something went wrong while update category brand",
				data: response ? response : {},
			})
		}
	)

	updateCategoryOption = asyncHandler(async (req: Request, res: Response) => {
		const { productCategory_id } = req.params
		const { option } = req.body
		if (!productCategory_id) {
			throw new Error("Missing product category ID")
		}
		if (!option.length) {
			throw new Error("Missing option to add to category")
		}
		const response = await ProductCategory.findByIdAndUpdate(
			{ _id: productCategory_id, option },
			req.body,
			{ new: true }
		)
		const io = req.app.get("io")
		io.emit("categoryUpdate")
		res.json({
			success: response ? true : false,
			message: response
				? "Success update category option"
				: "Something went wrong while update category option",
			data: response ? response : {},
		})
	})

	deleteCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { productCategory_id } = req.params

			const response = await ProductCategory.findByIdAndDelete(
				productCategory_id
			)
			res.json({
				success: response ? true : false,
				message: response
					? "Success delete a category"
					: "Something went wrong while delete category",
				data: response ? response : {},
			})
		}
	)
}

export default new ProductCategoryController()
