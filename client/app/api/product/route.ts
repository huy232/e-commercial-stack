import { instance } from "@/axios"

interface GetProductsParams {
	sort?: string
	limit?: number
	page?: number
	totalRatings?: number
}

export const getProducts = (params: GetProductsParams) =>
	instance({
		url: "/product/get-all-product",
		method: "get",
		params,
	})

export const getDailyDeal = () =>
	instance({
		url: "/product/daily-product",
		method: "get",
	})
