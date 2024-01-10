export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
	message?: string
}

export interface ApiResponseProductCategories {
	success: boolean
	data: ProductCategory[]
	error?: string
}
