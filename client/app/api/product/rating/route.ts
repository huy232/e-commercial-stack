import { API } from "@/constant"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")

		const response = await fetch(`${API}/product/rating-product`, {
			method: "PUT",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieString,
			},
			credentials: "include",
			body: JSON.stringify(body),
		})

		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error rating:", error)
		return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}
}
