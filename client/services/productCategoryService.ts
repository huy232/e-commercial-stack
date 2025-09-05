import { API } from "@/constant"
import { ProductCategory, ApiResponse } from "@/types"

export const getProductCategories = async (): Promise<
	ApiResponse<ProductCategory[]>
> => {
	try {
		const response = await fetch(`/api/product-category`, {
			method: "GET",
			credentials: "include",
			cache: "no-cache",
		})
		if (!response.ok) {
			throw new Error(
				`Failed to fetch product categories. Status: ${response.status}`
			)
		}

		const responseData: ApiResponse<ProductCategory[]> = await response.json()

		return responseData
	} catch (error) {
		console.error("Error fetching product categories:", error)
		throw error
	}
}
