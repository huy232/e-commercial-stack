export type VariantProperties = {
	[key: string]: string | number
}

export interface CartState {
	cart: IUserCart | null
	isLoading: boolean
	error: string
}
export interface Cart {
	product: ProductExtraType
	variant: {
		price: number
		stock: number
		variant: { type: string; value: string }[]
		_id: string
	}
	quantity: number
}

export interface ICart {
	success: boolean
	data: Cart[]
	message: string
}
