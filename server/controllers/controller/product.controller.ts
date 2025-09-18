import { Request, Response } from "express"
import { Brand, Order, Product, ProductCategory } from "../../models"
import asyncHandler from "express-async-handler"
import slugify from "slugify"
import { parseInteger } from "../../utils/parseInteger"
import { AuthenticatedRequest } from "../../types/user"
import moment from "moment"
import { DailyDeal } from "../../models/model/dailyDeal.model"
import { ProductType } from "../../../client/types/product"
import { UploadedFile, UploadedFiles } from "../../types/uploadFile"
import { v4 as uuidv4 } from "uuid"
import { filterCategory } from "../../data/filterCategory"
import { getVariantFilters } from "../../utils/getVariantFilters"
import mongoose, { ObjectId, Types } from "mongoose"
import { NotifyService } from "../../services"

class ProductController {
	static cachedDailyDeal: {
		product: ProductType
		expirationTime: string
	} | null = null

	createProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const {
				productName,
				price,
				description,
				brand,
				category,
				allowVariants,
				publicProduct,
				variants,
			} = req.body
			const images = req.files as UploadedFiles
			if (!images || !images.thumbnail || !images.productImages) {
				res.status(400).json({ message: "No images uploaded" })
				return
			}
			if (!(productName && price && description && brand && category)) {
				throw new Error("Missing inputs")
			}
			const productImageURLs = images.productImages.map(
				(image: UploadedFile) => image.path
			)

			req.body.images = productImageURLs
			req.body.slug = slugify(productName)
			req.body.totalRatings = 0
			req.body.rating = []
			req.body.sold = 0
			req.body.thumbnail = images.thumbnail[0].path
			req.body.title = productName
			req.body.category = category
			req.body.allowVariants = allowVariants
			req.body.public = publicProduct
			req.body.variants = JSON.parse(variants)
			const newProduct = await Product.create(req.body)
			res.status(200).json({
				success: !!newProduct,
				message: !!newProduct
					? "Success created product"
					: "Cannot create new product",
				data: !!newProduct ? newProduct : {},
			})
		}
	)

	getProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_slug } = req.params
			try {
				const product = await Product.findOne({ slug: product_slug })
					.populate({
						path: "ratings",
						populate: {
							path: "postedBy",
							select: "firstName lastName avatar",
						},
					})
					.populate("brand")
					.populate("category")

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
				// Convert query keys to lowercase to match optionKey
				const queries: Record<string, any> = {}
				Object.keys(req.query).forEach((key) => {
					queries[key.toLowerCase()] = req.query[key]
				})

				const excludeFields = [
					"limit",
					"sort",
					"page",
					"fields",
					"type",
					"order",
				]
				excludeFields.forEach((element) => delete queries[element])

				let queryString = JSON.stringify(queries)

				queryString = queryString.replace(
					/\b(gte|gt|lt|lte)\b/g,
					(matchedElement) => `$${matchedElement}`
				)
				const formattedQueries = JSON.parse(queryString)
				const priceFilter: any = {}
				// Handle search
				if (queries.search as string) {
					delete formattedQueries.search
					formattedQueries["$or"] = [
						{ title: { $regex: queries.search, $options: "i" } },
					]
				}

				// Handle title
				if (queries.title) {
					formattedQueries.title = { $regex: queries.title, $options: "i" }
				}

				// Handle category filtering
				let categoryId: Types.ObjectId | null = null
				if (queries.category) {
					const category = await ProductCategory.findOne({
						title: { $regex: queries.category, $options: "i" },
					})
					if (category) {
						categoryId = category._id
						formattedQueries.category = categoryId
						// Dynamic variant filtering
						// Dynamic variant filtering
						const categoryOptions = category.option || []
						const variantQueries = []

						for (const option of categoryOptions) {
							const optionKey = option.type.toLowerCase() // Use exact type (e.g., 'color', 'storage')

							if (queries[optionKey.toLowerCase()]) {
								// Query params are in lowercase
								const values = (
									queries[optionKey.toLowerCase()] as string
								).split(",")

								// Push a condition for each option type and values to match
								variantQueries.push({
									variants: {
										$elemMatch: {
											"variant.type": new RegExp(option.type, "i"), // Match `type` in a case-insensitive way
											"variant.value": {
												$in: values.map((value) => new RegExp(value, "i")),
											}, // Match values case-insensitively
										},
									},
								})

								// Remove the option from main queries to avoid conflict
								delete formattedQueries[optionKey.toLowerCase()]
							}
						}

						// If there are dynamic option filters, apply them using $and
						if (variantQueries.length > 0) {
							formattedQueries.$and = variantQueries
						}
					}
				}

				// Handle brand filtering
				let brandId: Types.ObjectId | null = null
				if (queries.brand) {
					const brand = await Brand.findOne({
						title: { $regex: queries.brand, $options: "i" },
					})
					brandId = brand ? brand._id : null
					if (brandId) {
						formattedQueries.brand = brandId
					}
				}

				// Handle price filtering
				if (queries.from) {
					priceFilter.$gte = parseInt(queries.from as string)
					delete formattedQueries.from
				}
				if (queries.to) {
					priceFilter.$lte = parseInt(queries.to as string)
					delete formattedQueries.to
				}
				if (Object.keys(priceFilter).length > 0) {
					formattedQueries.price = priceFilter
				}

				// Build the query
				let query = Product.find(formattedQueries)
					.populate("brand")
					.populate("category")

				// Handle sorting
				if (req.query.sort as string) {
					const sortBy = (req.query.sort as string).split(",").join(" ")
					query = query.sort(sortBy)
				}

				// Handle field limiting
				if (req.query.fields as string) {
					const fields = (req.query.fields as string).split(",").join(" ")
					query = query.select(fields)
				}

				if (req.query.sort) {
					delete formattedQueries.type
					delete formattedQueries.order
					const sortField = req.query.sort as string
					const sortOrder = req.query.order === "desc" ? -1 : 1 // Default to "asc"
					query = query.sort({ [sortField]: sortOrder })
				}

				// Handle pagination
				const page = parseInteger(req.query.page, 1)
				const limit = parseInteger(req.query.limit, 9)
				const skip = (page - 1) * limit
				query.skip(skip).limit(limit)

				const response = await query.exec()
				const counts = await Product.countDocuments(formattedQueries)
				const totalPages = Math.ceil(counts / limit) || 1
				const currentPage = page

				res.status(200).json({
					success: response ? true : false,
					message: response
						? "Successfully queried all products"
						: "Something went wrong while finding all products",
					data: response ? response : {},
					counts,
					totalPages,
					currentPage,
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

	getProductsOnSale = asyncHandler(async (req: Request, res: Response) => {
		const now = new Date()

		const [percentageDiscountProducts, fixedDiscountProducts] =
			await Promise.all([
				Product.find({
					enableDiscount: true,
					"discount.type": "percentage",
					"discount.expirationDate": { $gt: now },
					publicProduct: true,
					deleted: false,
				})
					.populate("brand")
					.populate("category"),

				Product.find({
					enableDiscount: true,
					"discount.type": "fixed",
					"discount.expirationDate": { $gt: now },
					publicProduct: true,
					deleted: false,
				})
					.populate("brand")
					.populate("category"),
			])

		res.status(200).json({
			success: true,
			message: "Successfully fetched discounted products",
			data: {
				percentageDiscountProducts,
				fixedDiscountProducts,
			},
		})
	})

	updateProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const { product_id } = req.params
			const images = req.files as UploadedFiles

			if (req.body && req.body.title) {
				req.body.slug = slugify(req.body.title)
			}

			if (images.thumbnail) {
				req.body.thumbnail = images.thumbnail[0].path
			}

			let uploadedImageURLs: string[] = []
			if (images.productImages) {
				uploadedImageURLs = images.productImages.map(
					(image: UploadedFile) => image.path
				)
			}

			let existingProductImages: string[] = []
			if (req.body.existingProductImages) {
				try {
					existingProductImages = JSON.parse(req.body.existingProductImages)
				} catch (err) {
					console.error("Failed to parse existingProductImages:", err)
					existingProductImages = []
				}
			}

			// ✅ Always update images, whether or not new ones were uploaded
			req.body.images = [...existingProductImages, ...uploadedImageURLs]

			if (req.body.variants) {
				req.body.variants = JSON.parse(req.body.variants)
			}

			const existingProduct = await Product.findById(product_id)
			if (!existingProduct) {
				res.status(404).json({ success: false, message: "Product not found" })
				return
			}

			if (
				req.body.enableDiscount === "true" ||
				req.body.enableDiscount === true
			) {
				req.body.enableDiscount = true
				let productOriginalPrice
				if (req.body.price) {
					productOriginalPrice = req.body.price
				} else {
					const product = await Product.findById({ product_id })
					productOriginalPrice = product?.price
				}
				let discountType = req.body.discountType
				let productPrice
				if (discountType === "percentage") {
					productPrice =
						productOriginalPrice -
						(productOriginalPrice * req.body.discountValue) / 100
				}
				if (discountType === "fixed") {
					productPrice = productOriginalPrice - req.body.discountValue
				}
				req.body.discount = {
					type: req.body.discountType,
					value: req.body.discountValue,
					expirationDate: req.body.discountExpirationDate
						? new Date(req.body.discountExpirationDate)
						: null,
					productPrice: productPrice,
				}

				// Remove individual discount fields from req.body
				delete req.body.discountType
				delete req.body.discountValue
				delete req.body.discountExpirationDate
			} else {
				req.body.enableDiscount = false
				req.body.discount = null // Clear discount if enableDiscount is false
			}
			const updatedProduct = await Product.findByIdAndUpdate(
				product_id,
				req.body,
				{ new: true }
			)

			const validDiscount =
				updatedProduct?.enableDiscount &&
				updatedProduct.discount?.expirationDate &&
				new Date(updatedProduct.discount.expirationDate) > new Date() && // Check if discount is still valid
				updatedProduct.discount.value < existingProduct.price // Ensure it's actually discounted

			if (validDiscount) {
				await NotifyService.notifyWishlistUsers(
					product_id,
					req.app.get("io") // Pass Socket.IO instance
				)
			}

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
			const deletedProduct = await Product.findByIdAndDelete(product_id)
			// const deletedProduct = { product: "Something" }
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
			const { star, comment, product_id, updatedAt } = req.body
			if (!star || !product_id || !comment || !updatedAt) {
				throw new Error("Missing input while rating product")
			}

			const hasBought = await Order.exists({
				orderBy: _id,
				"products.product._id": product_id,
				status: { $in: ["Cancelled", "Success", "Refund"] },
			})

			if (!hasBought) {
				res.status(403).json({
					status: false,
					message: "You can only rate products you have purchased",
					allowToComment: false,
				})
				return
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
						$set: {
							"ratings.$.star": star,
							"ratings.$.comment": comment,
							"ratings.$.updatedAt": updatedAt,
						},
					},
					{ new: true }
				)
			} else {
				await Product.findByIdAndUpdate(
					product_id,
					{
						$push: { ratings: { star, comment, postedBy: _id, updatedAt } },
					},
					{ new: true }
				)
			}

			const updatedProduct = await Product.findById(product_id).populate({
				path: "ratings.postedBy",
				select: "firstName lastName avatar",
			})

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
			// let cachedDeal = ProductController.cachedDailyDeal
			res.setHeader("Cache-Control", "no-store")
			// Check if the cached deal exists and is not expired
			// if (cachedDeal && moment().isBefore(moment(cachedDeal.expirationTime))) {
			// 	res.json({
			// 		success: true,
			// 		message: "Fetch daily deal from cache",
			// 		data: cachedDeal.product,
			// 		expirationTime: cachedDeal.expirationTime,
			// 	})
			// 	return
			// }

			// Fetch a new random product
			const randomProduct = await Product.aggregate([
				{ $match: { totalRatings: { $gte: 5 } } },
				{ $sample: { size: 1 } },
			])

			// Update the MongoDB and cache with the new deal
			if (randomProduct && randomProduct.length > 0) {
				const expirationTime = moment().endOf("day").toISOString()
				// await ProductController.updateCachedDailyDeal(
				// 	randomProduct[0],
				// 	expirationTime
				// )

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

	addVariant = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				const { product_id } = req.params
				const { title, price, color } = req.body
				const images = req.files as UploadedFiles
				if (!(title && price && color)) {
					throw new Error("Missing inputs")
				}

				if (images.productImages) {
					const productImageURLs = images.productImages.map(
						(image: UploadedFile) => image.path
					)
					let existingProductImages = req.body.productImages || []
					if (!Array.isArray(existingProductImages)) {
						existingProductImages = [existingProductImages]
					}
					const productImages = [...existingProductImages, ...productImageURLs]
					req.body.productImages = productImages
				}
				if (images.thumbnail) {
					const thumbnail = images.thumbnail[0].path || req.body.thumbnail
					req.body.thumbnail = thumbnail
				}
				const existingVariant = await Product.findOneAndUpdate(
					{
						_id: product_id,
						variants: { $elemMatch: { $or: [{ color }] } },
					},
					{
						$set: {
							"variants.$.price": price,
							"variants.$.images": req.body.productImages,
							"variants.$.thumbnail": req.body.thumbnail,
						},
					},
					{ new: true }
				)

				if (!existingVariant) {
					const response = await Product.findByIdAndUpdate(
						product_id,
						{
							$addToSet: {
								variants: {
									color,
									title,
									price,
									images: req.body.productImages,
									thumbnail: req.body.thumbnail,
									sku: uuidv4(),
								},
							},
						},
						{ new: true }
					)
					res.json({
						success: response ? true : false,
						message: response
							? "Update variant for product successfully"
							: "Failed update variant for product",
						data: response ? response : {},
					})
				} else {
					res.json({
						success: true,
						message: "Variant updated successfully",
						data: existingVariant,
					})
				}
			} catch (error) {
				console.error("Error uploading image:", error)
				res
					.status(500)
					.json({ success: false, message: "An unexpected error occurred." })
			}
		}
	)

	getProductCategoryCounts = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			try {
				// Aggregation pipeline to filter, lookup, group, and count
				const categoryCounts = await Product.aggregate([
					// Match documents where the category field exists
					{ $match: { category: { $exists: true, $ne: null } } },
					// Lookup to join with the ProductCategory collection and get category info
					{
						$lookup: {
							from: "productcategories", // Name of the ProductCategory collection in MongoDB
							localField: "category", // The field in the Product collection that references ProductCategory
							foreignField: "_id", // The field in the ProductCategory collection to match with
							as: "categoryInfo", // Name the output field to hold the populated category info
						},
					},
					// Unwind categoryInfo array to handle each category individually
					{ $unwind: "$categoryInfo" },
					// Match again to exclude any unwanted categories (like "Home" by title)
					{ $match: { "categoryInfo.title": { $ne: "Home" } } },
					// Group by category title and count the number of products in each category
					{
						$group: {
							_id: "$categoryInfo.title", // Group by category title
							count: { $sum: 1 }, // Count the number of products in each category
						},
					},
					// Sort the categories by count in descending order
					{ $sort: { count: -1 } },
				])

				res.status(200).json(categoryCounts)
			} catch (error) {
				res.status(500).json({
					message: "Error retrieving product category counts",
					error,
				})
			}
		}
	)

	// normalizeProduct = asyncHandler(async (req: Request, res: Response) => {
	// 	const products = await Product.find({})

	// 	// Loop through each product
	// 	for (const product of products) {
	// 		if (product.variants) {
	// 			const updatedVariants = product.variants.map((variant: any) => {
	// 				const normalizedVariant: any = {}

	// 				// Normalize all keys to lowercase
	// 				Object.keys(variant).forEach((key) => {
	// 					normalizedVariant[key.toLowerCase()] = variant[key]
	// 				})

	// 				return normalizedVariant
	// 			})

	// 			// Update the product with the new normalized variants
	// 			product.variants = updatedVariants
	// 			await product.save()
	// 		}
	// 	}
	// 	res.status(200).json({ message: "Success" })
	// })

	normalizeProduct = asyncHandler(async (req: Request, res: Response) => {
		const products = await Product.find({})
		for (const product of products) {
			if (product.variants && product.variants.length > 0) {
				const updatedVariants = product.variants.map((variant: any) => {
					// Destructure fixed fields
					const rawVariant = variant.toObject()
					const { stock, price, _id, ...dynamicFields } = rawVariant
					const formattedVariantArray = Object.keys(dynamicFields).map(
						(key) => ({
							type: key,
							value: dynamicFields[key],
						})
					)
					return {
						stock,
						price,
						_id,
						variant: formattedVariantArray,
					}
				})

				// Update the product's variants array with the modified format
				product.variants = updatedVariants
				product.markModified("variants") // Mark the variants field as modified
				await product.save() // Save changes
			}
		}

		res.status(200).json({ message: "Success" })
	})

	productBrand = asyncHandler(async (req: Request, res: Response) => {
		try {
			// Step 1: Aggregate brands that have at least 5 associated products, then randomly pick 5
			const brandsWithProducts = await Product.aggregate([
				{ $group: { _id: "$brand", count: { $sum: 1 } } }, // Group products by brand and count them
				{ $match: { count: { $gte: 3 } } }, // Filter to include only brands with at least # products
				{ $sample: { size: 5 } }, // Randomly select 5 brands
			])

			// Get the brand IDs from the aggregation result
			const brandIds = brandsWithProducts.map((b) => b._id)

			// Step 2: Find the details of the selected brands
			const randomBrands = await Brand.find({ _id: { $in: brandIds } })

			// Step 3: Find products for each brand, limited to 5 products per brand
			const productPromises = brandIds.map(async (brandId) => {
				const products = await Product.find({ brand: brandId })
					.limit(5) // Limit to 5 products per brand
					.populate("brand") // Populate brand info
					.populate("category") // Populate category info
				return { brandId, products }
			})

			// Step 4: Wait for all promises to resolve
			const productsByBrand = await Promise.all(productPromises)

			// Step 5: Structure and send the response
			const result = productsByBrand.map(({ brandId, products }) => {
				const brand = randomBrands.find((b) => b._id.equals(brandId))

				// Check if brand exists to avoid undefined error
				if (brand) {
					return {
						brand: {
							_id: brand._id,
							title: brand.title,
						},
						products,
					}
				} else {
					return {
						brand: null, // Handle the case where brand is not found
						products,
					}
				}
			})

			res.status(200).json({
				success: true,
				message:
					"Successfully fetched products for random brands with at least 5 products",
				data: result,
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching products by brand",
				error,
			})
		}
	})
}

export default new ProductController()
