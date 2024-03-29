import { API } from "@/constant"
import {
	ProductType,
	ApiResponse,
	ApiProductResponse,
	CreateProductType,
} from "@/types"

interface GetProductsParams {
	limit?: number
	page?: number
	[key: string]: string | number | undefined | string[]
}

export const getProducts = async (
	params: GetProductsParams
): Promise<ApiProductResponse<ProductType[]>> => {
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

		const responseData: ApiProductResponse<ProductType[]> =
			await response.json()
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
			cache: "no-cache",
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
	pid: string,
	updatedAt: number
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
				updatedAt,
			}),
		})
		const responseData: ApiResponse<ProductType> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}

export const createProduct = async (formData: FormData) => {
	try {
		const response = await fetch(`${API}/product/create-product`, {
			method: "POST",
			credentials: "include",
			body: formData,
		})
		const responseData = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}

export const updateProduct = async (product_id: string, formData: FormData) => {
	try {
		const response = await fetch(
			`${API}/product/update-product/${product_id}`,
			{
				method: "PUT",
				credentials: "include",
				body: formData,
			}
		)
		const responseData = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}

export const removeProduct = async (product_id: string) => {
	try {
		const response = await fetch(
			`${API}/product/delete-product/${product_id}`,
			{ method: "DELETE", credentials: "include" }
		)
		const responseData = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}

export const updateProductVariant = async (
	product_id: string,
	formData: FormData
) => {
	try {
		const response = await fetch(`${API}/product/variant/${product_id}`, {
			method: "PUT",
			credentials: "include",
			body: formData,
		})
		const responseData = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
