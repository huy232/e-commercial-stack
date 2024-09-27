import mongoose from "mongoose"
import { Request, Response } from "express"
import { Product, ProductCategory } from "../../models"
import data from "../../data/data2.json"
import { brandCategory } from "../../data/cate_brand"
import slugify from "slugify"
import asyncHandler from "express-async-handler"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"
import { promisify } from "util"
import { writeFileSync } from "fs"

interface ProductData {
	category: string[]
	name: string
	brand: string
	thumb: string
	images: string[]
	price: string
	description: string[]
	variants: IVariant[]
	informations: {
		[key: string]: string
	}
	allowVariants: boolean
	publicProduct: boolean
}

interface CategoryBrandData {
	cate: string
	brand: string[]
	image: string
}

interface IVariantOption {
	value: string
	price?: number
}

interface IVariant {
	[key: string]: string | number | undefined
	stock?: number
	price?: number
}

interface IProduct {
	category: string[]
	name: string
	brand: string
	thumb: string
	images: string[]
	price: string
	description: string[]
	variants: IVariant[]
	informations: {
		DESCRIPTION: string
		WARRANTY: string
		DELIVERY: string
		PAYMENT: string
	}
}

const insertProductFn = async (product: ProductData) => {
	const priceMatch = product.price.match(/\d/g)
	const priceNumeric = Number(priceMatch?.join(""))
	const roundedPrice = Math.round(priceNumeric / 100)

	const uniqueSlug = slugify(product.name) + "-" + uuidv4()
	const variants = product.variants.map((variant: any) => ({
		...variant,
		_id: new mongoose.Types.ObjectId(), // Ensure an ObjectId is generated
	}))
	await Product.create({
		title: product.name,
		slug: uniqueSlug,
		description: product.description.toString(),
		brand: product.brand,
		price: roundedPrice,
		category: product.category,
		quantity: Math.round(Math.random() * 1000),
		sold: Math.round(Math.random() * 100),
		images: product.images,
		thumbnail: product.thumb,
		totalRatings: Math.floor(Math.random() * 5) + 1,
		variants,
		allowVariants: product.allowVariants,
		publicProduct: product.publicProduct,
	})
}

const insertCategoryFn = async (categoryBrand: CategoryBrandData) => {
	await ProductCategory.create({
		title: categoryBrand.cate,
		brand: categoryBrand.brand,
		slug: slugify(categoryBrand.cate, { trim: true, lower: true }),
		image: categoryBrand.image,
	})
}

class InsertDataController {
	static generateRandomPrice(): number {
		return Math.floor(Math.random() * (300000 - 100000 + 1)) + 100000
	}

	editProduct = async (req: Request, res: Response): Promise<void> => {
		try {
			const filePath = path.resolve(__dirname, "../../data/data2.json")
			const rawData = fs.readFileSync(filePath, "utf8")
			const products: ProductData[] = JSON.parse(rawData)

			const modifiedData = products.map((product: ProductData) => {
				const allowVariants = product.variants.length > 0
				const publicValue = true
				let modifiedVariants: IVariant[] = []

				if (product.variants.length > 0) {
					// Get all options from different variant types
					const allOptions: any[] = []
					product.variants.forEach((variantGroup: any) => {
						const options = variantGroup.options.map((option: any) => {
							return {
								type: variantGroup.type.toLowerCase(),
								value: option.value,
								price:
									option.price || Math.floor(Math.random() * 1000000) + 100000, // Use provided price if available, otherwise generate random price
							}
						})
						allOptions.push(options)
					})

					// Generate combinations of options
					const generateCombinations = (
						arr: any[],
						index: number,
						current: any[]
					) => {
						if (index === arr.length) {
							const variant: IVariant = {}
							current.forEach((option) => {
								variant[option.type] = option.value
								variant.price = option.price
							})
							variant.stock = current.some(
								(option) => option.stock !== undefined
							)
								? current.find((option) => option.stock !== undefined)?.stock
								: Math.floor(Math.random() * 101)
							modifiedVariants.push(variant)
						} else {
							arr[index].forEach((option: any) => {
								generateCombinations(arr, index + 1, current.concat(option))
							})
						}
					}

					generateCombinations(allOptions, 0, [])
				}

				return {
					category: product.category,
					name: product.name,
					brand: product.brand,
					thumb: product.thumb,
					images: product.images,
					price: product.price,
					description: product.description,
					variants: modifiedVariants,
					informations: product.informations,
					allowVariants,
					publicProduct: publicValue,
				}
			})

			fs.writeFileSync(filePath, JSON.stringify(modifiedData, null, 2))

			res.json("Done editing product data")
		} catch (error) {
			res.status(500).json({ message: "Error editing product data", error })
		}
	}

	insertProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const promises = []

			for (let product of data) {
				promises.push(insertProductFn(product))
			}

			await Promise.all(promises)

			res.status(200).json({
				message: "Done creating product",
			})
		}
	)

	deleteAllProducts = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await Product.deleteMany()

			res.status(200).json({
				message: "Done",
				deleted: response ? response : {},
			})
		}
	)

	insertCategory = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const promises = []

			for (let category of brandCategory) {
				promises.push(insertCategoryFn(category))
			}

			await Promise.all(promises)

			res.json("Done category data")
		}
	)

	deleteAllCategories = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const response = await ProductCategory.deleteMany()

			res.status(200).json({
				message: "Done",
				deleted: response ? response : {},
			})
		}
	)
}

export default new InsertDataController()
