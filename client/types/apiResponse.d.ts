export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
}

export interface ApiResponseProductCategories {
	success: boolean
	data: ProductCategory[]
	error?: string
}
