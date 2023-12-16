import axios from "axios"

interface GetProductsParams {
	sort?: string
	limit?: number
	page?: number
	totalRatings?: number
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URI,
})

export const getProducts = (params: GetProductsParams) =>
	api({
		url: "/product/get-all-product",
		method: "get",
		params,
	})

export const getDailyDeal = () =>
	api({
		url: "/product/daily-product",
		method: "get",
	})
