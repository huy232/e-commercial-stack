import axios from "@/axios"

export const getProductCategories = async () => {
	const response = await axios.get("/product-category")
	return response.data
}
