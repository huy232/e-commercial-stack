import { API } from "@/constant"
import { ApiProductCategoryResponse } from "@/types"
import { ProductCategoryType } from "@/types/productCategory"

export const getProductCategory = async (): Promise<
	ApiProductCategoryResponse<ProductCategoryType[]>
> => {
	try {
		const url = `${API}/product-category`
		const response = await fetch(url, {
			method: "GET",
		})

		const responseData: ApiProductCategoryResponse<ProductCategoryType[]> =
			await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
