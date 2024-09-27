import { API } from "@/constant"
import { NextRequest } from "next/server"

type Params = {
	limit?: number
	page?: number
	[key: string]: string | number | undefined | string[]
}

export async function GET(request: NextRequest, context: { params: Params }) {
	const params = request.nextUrl.searchParams
	// const queryParamsArray: Array<[string, string]> = []

	// for (const [key, value] of Object.entries(params)) {
	// 	if (value !== undefined) {
	// 		if (Array.isArray(value)) {
	// 			for (const item of value) {
	// 				queryParamsArray.push([key, item.toString()])
	// 			}
	// 		} else {
	// 			queryParamsArray.push([key, value.toString()])
	// 		}
	// 	}
	// }
	const queryParams = new URLSearchParams(params)
	const url = `${API}/product/get-all-product?${queryParams.toString()}`
	const response = await fetch(url, {
		method: "GET",
		cache: "no-cache",
	})
	const data = await response.json()
	return Response.json(data)
}
