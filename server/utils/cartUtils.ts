import { ICartItem, ICartItemPopulate, IProduct } from "../models" // Adjust the import paths according to your project structure

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
			},
			variant: variantDetails || undefined,
			quantity: item.quantity,
		}
	})
}
