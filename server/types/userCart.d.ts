export interface UserCart {
	product: {
		_id: string
		title: string
		thumbnail: string
		quantity: number
		price: number
		allowVariants: boolean
	}
	variant: {
		price: number
		stock: number
		[key: string]: any
		_id: string
	}
	quantity: number
}
