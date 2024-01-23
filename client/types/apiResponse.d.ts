export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
	errors?: []
}

export interface ApiResponseProductCategories {
	success: boolean
	data: ProductCategory[]
	error?: string
}

export interface ApiResponseLogin {
	success: boolean
	message?: string
	accessToken?: string
	userData?: {
		id: string
		_v: number
		updatedAt: Date
		passwordChangedAt: Number
		lastName: string
		isBlocked: boolean
		firstName: string
		email: string
		createdAt: Date
		cart: []
		address: []
	}
}
