export type CheckoutItem = {
	price_data: {
		currency: string
		product_data: {
			name: string
			images: string[]
			description?: string
		}
		unit_amount: number
	}
	quantity: number
}
