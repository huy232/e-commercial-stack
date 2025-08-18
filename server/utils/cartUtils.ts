import mongoose from "mongoose"
import { ICartItem, IProduct } from "../models" // Adjust the import paths according to your project structure

export const transformCartItems = (cartItems: ICartItem[]) => {
	return cartItems.map((item) => {
		const productDetails = item.product_id as unknown as IProduct
		const variantDetails = item.variant_id
			? productDetails.variants?.find(
					(v) => v._id.toString() === item.variant_id?.toString()
			  )
			: undefined

		return {
			product: {
				_id: productDetails._id,
				title: productDetails.title,
				thumbnail: productDetails.thumbnail,
				price: productDetails.price,
				allowVariants: productDetails.allowVariants,
				quantity: productDetails.quantity,
				enableDiscount: productDetails.enableDiscount,
				discount: productDetails.discount ? productDetails.discount : null,
				category: productDetails.category,
			},
			variant: variantDetails || undefined,
			quantity: item.quantity,
		}
	})
}

/**
 * Finds the matching variant details from a product given a variant ID.
 * @param product - The product containing variants.
 * @param variantId - The ID of the variant to find.
 * @returns The matching variant object or `null` if not found.
 */
export const findVariantDetails = (
	product: IProduct,
	variantId?: mongoose.Types.ObjectId | string | null
) => {
	if (!variantId || !product.variants) return null

	return (
		product.variants.find(
			(variant) => variant._id.toString() === variantId.toString()
		) || null
	)
}

/**
 * Transforms a cart item by attaching the correct product and variant details.
 * @param item - The cart item containing product and variant references.
 * @returns A transformed cart item with the resolved product and variant details.
 */

export const transformCartItem = (item: any) => {
	const product = item.product_id as IProduct
	return {
		product: {
			_id: product._id,
			title: product.title,
			thumbnail: product.thumbnail,
			price: product.price,
			allowVariants: product.allowVariants,
			quantity: product.quantity,
			enableDiscount: product.enableDiscount,
			discount: product.discount,
			category: product.category,
		},
		variant: findVariantDetails(product, item.variant_id), // Now this should work
		quantity: item.quantity,
	}
}
