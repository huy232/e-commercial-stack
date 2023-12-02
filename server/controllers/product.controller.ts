import { Request, Response } from "express"
import { Product } from "../models"
import asyncHandler from "express-async-handler"
import slugify from "slugify"

const createProduct = asyncHandler(
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
				? "Success creating product"
				: "Cannot create new product",
			product: newProduct ? newProduct : {},
		})
	}
)

const getProduct = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { product_id } = req.params
		const product = await Product.findById(product_id)
		res.status(200).json({
			success: product ? true : false,
			message: product ? "Successfully get a product" : "Cannot find a product",
			product: product ? product : {},
		})
	}
)

const getAllProducts = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const products = await Product.find()
		res.status(200).json({
			success: products ? true : false,
			message: products
				? "Successfully get a product"
				: "Cannot find a product",
			product: products ? products : {},
		})
	}
)

const updateProduct = asyncHandler(
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

const deleteProduct = asyncHandler(
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

export default {
	createProduct,
	getProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
}
