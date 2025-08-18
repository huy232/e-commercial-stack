import { Request, Response } from "express"
import { Product, ProductCategory } from "../../models"
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

			const response = await ProductCategory.create({
				title,
				slug,
				image: req.body.image,
			})
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

			// Step 1: Remove the category from all related products
			await Product.updateMany(
				{ category: productCategory_id },
				{ $unset: { category: "" } } // or { $set: { category: null } }
			)

			// Step 2: Delete the category itself
			const response = await ProductCategory.findByIdAndDelete(
				productCategory_id
			)

			const hasProducts = await Product.exists({ category: productCategory_id })

			if (hasProducts) {
				res.status(400).json({
					success: false,
					message:
						"Cannot delete category because it is assigned to one or more products.",
				})
			}

			const io = req.app.get("io")
			io.emit("categoryUpdate")

			res.json({
				success: !!response,
				message: response
					? "Successfully deleted the category and cleared it from products."
					: "Something went wrong while deleting the category.",
				data: response || {},
			})
		}
	)
}

export default new ProductCategoryController()
