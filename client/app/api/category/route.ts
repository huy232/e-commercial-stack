import { instance } from "@/axios"

export const getProductCategories = async () => {
	const response = await instance.get("/product-category")
	return response.data
}
