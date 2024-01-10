import { API } from "@/constant"
import { ProductType, ApiResponse } from "@/types"

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
		const response = await fetch(`${API}/product/get-all-product`, {
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
		const response = await fetch(`${API}/product/daily-product`, {
			method: "GET",
		})

		const responseData: ApiResponse<ProductType[]> = await response.json()

		return responseData
	} catch (error) {
		// Handle error appropriately
		throw error
	}
}
