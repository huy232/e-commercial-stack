import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

type Params = {
	product_id: string
}

export async function DELETE(
	request: NextRequest,
	context: { params: Params }
) {
	try {
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")
		const { product_id } = context.params
		const url = `${API}/product/delete-product/${product_id}`
		const response = await fetch(url, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Cookie: cookieString,
			},
			cache: "no-cache",
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error deleting product:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error deleting product",
			},
			{ status: 500 }
		)
	}
}
