import axios from "@/axios"

interface GetProductsParams {
	sort?: string
	limit?: number
	page?: number
	totalRatings?: number
}

export const getProducts = (params: GetProductsParams) =>
	axios({
		url: "/product/get-all-product",
		method: "get",
		params,
	})

export const getDailyDeal = () =>
	axios({
		url: "/product/daily-product",
		method: "get",
	})
