import { ICart } from "./userCart.d"
export interface UserCart {
	product: {
		_id: string
		title: string
		thumbnail: string
		quantity: number
		price: number
		allowVariants: boolean
		discount: {
			type: "percentage" | "fixed"
			value: number
			expirationDate: Date
			productPrice: number
		}
		enableDiscount: boolean
	}
	variant: {
		price: number
		stock: number
		[key: string]: any
		_id: string
	}
	quantity: number
}

export interface UpdateCartItem {
	product_id: string
	variant_id?: string
	quantity: number
}
