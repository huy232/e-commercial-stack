import { API } from "@/constant"
import { ProductType, ApiResponse } from "@/types"

interface GetProductsParams {
	sort?: string
	limit?: number
	page?: number
	totalRatings?: number
	category?: string
}

export const getProducts = async (
	params: GetProductsParams
): Promise<ApiResponse<ProductType[]>> => {
	try {
		const queryParamsArray: [string, string][] = params
			? Object.entries(params).map(([key, value]) => [key, value.toString()])
			: []
		const queryParams = new URLSearchParams(queryParamsArray)
		const url = `${API}/product/get-all-product?${queryParams.toString()}`

		const response = await fetch(url, {
			method: "GET",
		})

		const responseData: ApiResponse<ProductType[]> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const getDailyDeal = async (): Promise<ApiResponse<ProductType[]>> => {
	try {
		const response = await fetch(`${API}/product/daily-product`, {
			method: "GET",
			cache: "no-cache",
		})

		const responseData: ApiResponse<ProductType[]> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const getSpecificProduct = async (
	productSlug: string
): Promise<ApiResponse<ProductType>> => {
	try {
		const response = await fetch(`${API}/product/get-product/${productSlug}`, {
			method: "GET",
			cache: "default",
		})
		const responseData: ApiResponse<ProductType> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
