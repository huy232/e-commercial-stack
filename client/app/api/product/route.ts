import { BASE_URL } from "@/constant"
import { ProductType } from "@/types"
import { ApiResponse } from "@/types/apiResponse"

interface GetProductsParams {
	sort?: string
	limit?: number
	page?: number
	totalRatings?: number
}

export const getProducts = async (
	params: GetProductsParams
): Promise<ApiResponse<ProductType[]>> => {
	try {
		const response = await fetch(`/api/product/get-all-product`, {
			method: "GET",
		})

		const responseData: ApiResponse<ProductType[]> = await response.json()

		return responseData
	} catch (error) {
		// Handle error appropriately
		throw error
	}
}

export const getDailyDeal = async (): Promise<ApiResponse<ProductType[]>> => {
	try {
		const response = await fetch(`/api/product/daily-product`, {
			method: "GET",
		})

		const responseData: ApiResponse<ProductType[]> = await response.json()

		return responseData
	} catch (error) {
		// Handle error appropriately
		throw error
	}
}
