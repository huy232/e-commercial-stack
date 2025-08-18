export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
	errors?: []
}

export interface ApiProductResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
	counts: number
	totalPages: number
	currentPage: number
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

export interface ApiUsersResponse<T> {
	success: boolean
	users: T
	error?: string
	message?: string
	counts: number
	totalPages: number
	currentPage: number
}

export interface ApiProductCategoryResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
	counts: number
	totalPages: number
	currentPage: number
}

export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
	pagination: {
		currentPage: number
		totalPages: number
		totalItems: number
		limit: number
	}
}

export type DiscountedProductsData = {
	percentageDiscountProducts: ProductType[]
	fixedDiscountProducts: ProductType[]
}

export type DiscountedProductsResponse = ApiResponse<DiscountedProductsData>
