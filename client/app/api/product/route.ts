import { API } from "@/constant"
import { ProductType, ApiResponse } from "@/types"

interface GetProductsParams {
	limit?: number
	page?: number
	[key: string]: string | number | undefined | string[]
}

export const getProducts = async (
	params: GetProductsParams
): Promise<ApiResponse<ProductType[]>> => {
	try {
		const queryParamsArray: Array<[string, string]> = []

		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				if (Array.isArray(value)) {
					for (const item of value) {
						queryParamsArray.push([key, item.toString()])
					}
				} else {
					queryParamsArray.push([key, value.toString()])
				}
			}
		}

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

export const productRating = async (
	star: number,
	comment: string,
	pid: string
): Promise<ApiResponse<ProductType>> => {
	try {
		const response = await fetch(`${API}/product/rating-product`, {
			method: "PUT",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				star,
				comment,
				product_id: pid,
			}),
		})
		const responseData: ApiResponse<ProductType> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
