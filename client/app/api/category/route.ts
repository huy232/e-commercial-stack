import { ProductCategory } from "@/types"
import { ApiResponse } from "@/types/apiResponse"

export const getProductCategories = async (): Promise<
	ApiResponse<ProductCategory[]>
> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URI}/product-category`,
			{
				method: "GET",
			}
		)
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
