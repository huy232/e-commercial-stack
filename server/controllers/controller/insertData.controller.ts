import { Request, Response } from "express"
import { Product, ProductCategory } from "../../models"
import data from "../../data/data2.json"
import { brandCategory } from "../../data/cate_brand"
import slugify from "slugify"
import asyncHandler from "express-async-handler"
import { v4 as uuidv4 } from "uuid"

interface ProductData {
	category: string[]
	name: string
	brand: string
	thumb: string
	images: string[]
	price: string
	description: string[]
	variants: { label: string; variants: string[] }[]
	infomations: { [key: string]: string }
}

interface CategoryBrandData {
	cate: string
	brand: string[]
	image: string
}

const insertProductFn = async (product: ProductData) => {
	const colorVariant =
		product.variants.find((element) => element.label === "Color")?.variants ||
		[]
	const priceMatch = product.price.match(/\d/g)
	const priceNumeric = Number(priceMatch?.join(""))
	const roundedPrice = Math.round(priceNumeric / 100)

	const uniqueSlug = slugify(product.name) + "-" + uuidv4()

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
		color: colorVariant,
	})
}

const insertCategoryFn = async (categoryBrand: CategoryBrandData) => {
	await ProductCategory.create({
		title: categoryBrand.cate,
		brand: categoryBrand.brand,
		slug: slugify(categoryBrand.cate, { trim: true, lower: true }),
	})
}

class InsertDataController {
	insertProduct = asyncHandler(
		async (req: Request, res: Response): Promise<void> => {
			const promises = []

			for (let product of data) {
				promises.push(insertProductFn(product))
			}

			await Promise.all(promises)

			res.json("Done product data")
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
