import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

type Params = {
	product_slug: string
}

export async function GET(request: NextRequest, context: { params: Params }) {
	const { product_slug } = context.params
	const url = `${API}/product/get-product/${product_slug}`

	const response = await fetch(url, {
		method: "GET",
	})
	const data = await response.json()
	return NextResponse.json(data)
}
