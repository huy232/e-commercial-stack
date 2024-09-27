import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

type Params = {
	product_id: string
}

export async function PUT(request: NextRequest, context: { params: Params }) {
	try {
		const { product_id } = context.params
		const body = await request.json()
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")

		const response = await fetch(
			`${API}/product/update-product/${product_id}`,
			{
				method: "POST",
				cache: "no-cache",
				headers: {
					Cookie: cookieString,
				},
				credentials: "include",
				body: JSON.stringify(body),
			}
		)
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error updating product:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error updating product",
			},
			{ status: 500 }
		)
	}
}
