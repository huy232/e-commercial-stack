import axios from "axios"

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URI,
})

export const getCategories = async () => {
	const response = await api.get("/product-category")
	return response.data
}
