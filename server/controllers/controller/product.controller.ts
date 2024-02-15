import { NextFunction, Request, Response } from "express"
import { Product } from "../../models"
import asyncHandler from "express-async-handler"
import slugify from "slugify"
import { parseInteger } from "../../utils/parseInteger"
import { AuthenticatedRequest } from "../../types/user"
import moment from "moment"
import { DailyDeal } from "../../models/model/dailyDeal.model"
import { ProductType } from "../../../client/types/product"

class ProductController {
	static cachedDailyDeal: {
		product: ProductType
		expirationTime: string
	} | null = null

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
				data: newProduct ? newProduct : {},
			})
		}
	)

	getProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_slug } = req.params

			try {
				const product = await Product.findOne({ slug: product_slug })

				if (product) {
					res.status(200).json({
						success: true,
						message: "Successfully get a product",
						data: product,
					})
				} else {
					res.status(404).json({
						success: false,
						message: "Cannot find a product with the specified slug",
						data: {},
					})
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					message: "Internal Server Error",
					data: {},
				})
			}
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
				if (queries.category) {
					formattedQueries.category = {
						$regex: queries.category,
						$options: "i",
					}
				}
				if (queries.color) {
					const formattedColorArray = formattedQueries.color.split(",")
					const colorQuery = formattedColorArray.map((color: string) => ({
						color: { $regex: color.trim(), $options: "i" },
					}))

					formattedQueries.$or = colorQuery
					delete formattedQueries.color
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
				const limit = parseInteger(req.query.limit, 10)
				const skip = (page - 1) * limit
				query.skip(skip).limit(limit)

				const response = await query.exec()
				// Count the documents
				const counts = await Product.countDocuments(formattedQueries)

				res.status(200).json({
					success: response ? true : false,
					message: response
						? "Successfully query all products"
						: "Something went wrong while finding all products",
					data: response ? response : {},
					counts,
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
				data: updatedProduct ? updatedProduct : {},
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
				data: deletedProduct ? deletedProduct : {},
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
				data: updatedProduct,
			})
		}
	)

	uploadImagesProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				const { product_id } = req.params
				if (!req.files || !Array.isArray(req.files)) {
					throw new Error("Missing images input")
				}

				const imagePaths = Array.from(req.files).map((file) => file.path)
				const response = await Product.findByIdAndUpdate(
					product_id,
					{
						$push: { images: { $each: imagePaths } },
					},
					{ new: true }
				)

				res.json({
					success: response ? true : false,
					message: response
						? "Uploaded all product images"
						: "Failed to upload product images",
					data: response ? response : {},
				})
			} catch (error) {
				console.error("Error uploading image:", error)
				res
					.status(500)
					.json({ success: false, message: "An unexpected error occurred." })
			}
		}
	)

	getRandomProductWithFiveStars = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			let cachedDeal = ProductController.cachedDailyDeal
			res.setHeader("Cache-Control", "no-store")
			// Check if the cached deal exists and is not expired
			if (cachedDeal && moment().isBefore(moment(cachedDeal.expirationTime))) {
				res.json({
					success: true,
					message: "Fetch daily deal from cache",
					data: cachedDeal.product,
					expirationTime: cachedDeal.expirationTime,
				})
				return
			}

			// Fetch a new random product
			const randomProduct = await Product.aggregate([
				{ $match: { totalRatings: { $gte: 5 } } },
				{ $sample: { size: 1 } },
			])

			// Update the MongoDB and cache with the new deal
			if (randomProduct && randomProduct.length > 0) {
				const expirationTime = moment().endOf("day").toISOString()
				await ProductController.updateCachedDailyDeal(
					randomProduct[0],
					expirationTime
				)

				res.json({
					success: true,
					message: "Fetch daily deal",
					data: randomProduct[0],
					expirationTime,
				})
			} else {
				res.json({
					success: false,
					message: "Failed to fetch daily deal",
					data: {},
					expirationTime: moment().endOf("day").toISOString(),
				})
			}
		} catch (error) {
			console.error("Error fetching random product with five stars:", error)
			res
				.status(500)
				.json({ success: false, message: "An unexpected error occurred." })
		}
	}

	static updateCachedDailyDeal = async (
		product: any,
		expirationTime: string
	): Promise<void> => {
		try {
			const existingDailyDeal = await DailyDeal.findOne({})
			if (existingDailyDeal) {
				existingDailyDeal.product = product
				existingDailyDeal.expirationTime = expirationTime
				await existingDailyDeal.save()
			} else {
				await DailyDeal.create({ product, expirationTime })
			}

			ProductController.cachedDailyDeal = { product, expirationTime }
		} catch (error) {
			console.error("Error updating daily deal in MongoDB:", error)
		}
	}
}

export default new ProductController()
