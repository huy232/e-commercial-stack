import { Request, Response } from "express"
import { Product } from "../../models"
import asyncHandler from "express-async-handler"
import slugify from "slugify"
import { parseInteger } from "../../utils/parseInteger"
import { AuthenticatedRequest } from "../../types/user"

class ProductController {
	createProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			if (Object.keys(req.body).length === 0) {
				throw new Error("Missing inputs")
			}
			if (req.body && req.body.title) {
				req.body.slug = slugify(req.body.title)
			}
			const newProduct = await Product.create(req.body)
			res.status(200).json({
				success: newProduct ? true : false,
				message: newProduct
					? "Success created product"
					: "Cannot create new product",
				product: newProduct ? newProduct : {},
			})
		}
	)

	getProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_id } = req.params
			const product = await Product.findById(product_id)
			res.status(200).json({
				success: product ? true : false,
				message: product
					? "Successfully get a product"
					: "Cannot find a product",
				product: product ? product : {},
			})
		}
	)

	getAllProducts = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				const queries = { ...req.query }
				const excludeFields = ["limit", "sort", "page", "fields"]
				excludeFields.forEach((element) => delete queries[element])

				let queryString = JSON.stringify(queries)
				queryString = queryString.replace(
					/\b(gte|gt|lt|lte)\b/g,
					(matchedElement) => `$${matchedElement}`
				)
				const formattedQueries = JSON.parse(queryString)
				// Filtering
				if (queries.title) {
					formattedQueries.title = { $regex: queries.title, $options: "i" }
				}

				let query = Product.find(formattedQueries)

				// Sorting
				if (req.query.sort as string) {
					const sortBy = (req.query.sort as string).split(",").join(" ")
					query = query.sort(sortBy)
				}

				// Fields limiting
				if (req.query.fields as string) {
					const fields = (req.query.fields as string).split(",").join(" ")
					query = query.select(fields)
				}

				const page = parseInteger(req.query.page, 1)
				const limit = parseInteger(req.query.limit, 2)
				const skip = (page - 1) * limit
				query.skip(skip).limit(limit)

				const response = await query.exec()
				// Count the documents
				const counts = await Product.countDocuments(formattedQueries)

				res.status(200).json({
					success: response ? true : false,
					counts,
					message: response
						? "Successfully query all products"
						: "Something went wrong while finding all products",
					products: response ? response : {},
				})
			} catch (err: any) {
				res.status(500).json({
					success: false,
					message: "Internal Server Error",
					error: err.message,
				})
			}
		}
	)

	updateProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_id } = req.params
			if (req.body && req.body.title) {
				req.body.slug = slugify(req.body.title)
			}
			const updatedProduct = await Product.findByIdAndUpdate(
				product_id,
				req.body,
				{ new: true }
			)
			res.status(200).json({
				success: updatedProduct ? true : false,
				message: updatedProduct
					? "Successfully update a product"
					: "Cannot update a product",
				product: updatedProduct ? updatedProduct : {},
			})
		}
	)

	deleteProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_id } = req.params
			if (req.body && req.body.title) {
				req.body.slug = slugify(req.body.title)
			}
			const deletedProduct = await Product.findByIdAndDelete(product_id)
			res.status(200).json({
				success: deletedProduct ? true : false,
				message: deletedProduct
					? "Successfully delete a product"
					: "Cannot delete a product",
				product: deletedProduct ? deletedProduct : {},
			})
		}
	)

	ratingProduct = asyncHandler(
		async (req: AuthenticatedRequest, res: Response): Promise<void> => {
			const { _id } = req.user
			const { star, comment, product_id } = req.body
			if (!star || !product_id) {
				throw new Error("Missing input while rating product")
			}
			const product = await Product.findById(product_id)
			const alreadyRatingProduct = product?.ratings.find(
				(element) => element.postedBy.toString() === _id
			)

			if (alreadyRatingProduct) {
				await Product.updateOne(
					{
						ratings: {
							$elemMatch: alreadyRatingProduct,
						},
					},
					{
						$set: { "ratings.$.star": star, "ratings.$.comment": comment },
					},
					{ new: true }
				)
			} else {
				await Product.findByIdAndUpdate(
					product_id,
					{
						$push: { ratings: { star, comment, postedBy: _id } },
					},
					{ new: true }
				)
			}

			const updatedProduct = await Product.findById(product_id)
			if (updatedProduct) {
				const ratingCalculate = updatedProduct.ratings.length
				const sumRating = updatedProduct.ratings.reduce(
					(acc, rating) => acc + Number(rating.star),
					0
				)
				updatedProduct.totalRatings =
					Math.round((sumRating * 10) / ratingCalculate) / 10

				await updatedProduct.save()
			}
			res.status(200).json({
				status: true,
				message: "Success update rating",
				updatedProduct,
			})
		}
	)

	uploadImagesProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				console.log("Hello world")
				console.log(req.file)

				// Your image processing logic here

				res.json({ success: true, message: "Uploaded" })
			} catch (error) {
				console.error("Error uploading image:", error)
				res
					.status(500)
					.json({ success: false, message: "An unexpected error occurred." })
			}
		}
	)
}

export default new ProductController()
